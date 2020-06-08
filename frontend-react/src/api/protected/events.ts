import Axios from 'axios'
import { getToken } from '../utils/index';
class DataProvider {
    baseUrl = `http://localhost:4000`
    accessToken = null
    get axios() {
        const accessToken = getToken()
        const axios = Axios.create({
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        return axios
    }
    getResource = async ({ meta, query, data }: { meta: any, query?: any, data?: any }) => {
        switch (meta.endpoint) {
            case '/': {
                return this.fetchList(query)
            }
            default:
                return Promise.reject(null)
        }

    }
    fetchList = async ({ meta, params }: { meta: { resource: string }, params?: GetParams }) => {
        const { resource } = meta
        let paramsString = ''
        if (params) {
            Object.keys(params).forEach((key: string, idx) => {
                //@ts-ignore
                paramsString = paramsString.concat(`${idx === 0 ? '?' : '&'}${key}=${params[key]}`)
            })
        }
        const res = await this.axios.get(`${this.baseUrl}/${resource}${paramsString}`)
        return res.data
    }
    addNew = async({meta, data}: { meta: { resource: string }, data: PostData }) =>{

        const { resource } = meta
        console.log(resource, data)
        //@ts-ignore
        const resourceData = data[resource]
        let body = {}
        Object.keys(resourceData).forEach(key=>{
           body =  Object.assign(body, resourceData[key] && { [key]: resourceData[key] })

        })
        const res = await this.axios.post(`${this.baseUrl}/${resource}`, body)
        return res.data
    }
}

type GetParams = {
    _end: number,
    _order: string,
    _sort: string,
    q: string,
    include: string
}
type PostData = {
   events?: EventData
}

type EventData = {
    name: string,
    location: Location;
    startTime: Date;
    duration: number;
    endTime: Date;
    owner: string;
    participants: string[]

}
const dataProvider = new DataProvider()
export default dataProvider

