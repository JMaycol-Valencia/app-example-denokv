import { Hono } from "https://deno.land/x/hono@v3.11.8/mod.ts"
import { serveStatic } from "https://deno.land/x/hono@v3.11.8/middleware.ts"
import { streamSSE } from "https://deno.land/x/hono@v3.11.8/helper/streaming/index.ts"

const db = await Deno.openKv()
const app = new Hono()
let i = 0;
interface LastVisit { 
    country: string
    city: string
    flag: string
}

app.get('/', serveStatic({path: './index.html'}))

// app.post('/counter',async (c) => {
//     (await db).atomic().sum(["visits"], 1n).commit()
//     return c.json({ message:'ok'})
// })

app.post('/visit',async (c) => {
    const {city , flag, country} = await c.req.json<LastVisit>()

    await db.atomic()
    .set(["lastVisit"], {country, city, flag})
    .sum(["visits"], 1n)
    .commit()

    return c.json({ message:'ok'})
})

app.get('/visit', (c)=> {
    return streamSSE(c,async (stream) => {
        const watcher = db.watch([["lastVisit"]])

        for await (const entry of watcher){
            const { value } = entry[0]

            if(value != null){
                await stream.writeSSE({data: JSON.stringify(value), event: 'update', id: String(i++)})
            }
        }
    })
})





// app.get('/counter', (c)=> {
//     return streamSSE(c,async (stream) => {
//         const visitKey = ["visits"]
//         const listOfKey = [visitKey]
//         const watcher = db.watch(listOfKey)

//         for await (const entry of watcher){
//             const { value } = entry[0]
//             if(value != null){
//                 await stream.writeSSE({data: value.toString(), event: 'update', id: String(i++)})
//             }
//         }

//         // while(true){
//         //     const { value } = await db.get(["visits"])
//         //     await stream.writeSSE({data:Number(value).toString(), event:'update', id: String(i++)})
//         //     await stream.sleep(1000)

//         //     // const message = `Son las ${new Date().toLocaleTimeString()}`
//         //     // await stream.writeSSE({data:message, event:'update', id: String(i++)})
//         //     // await stream.sleep(1000)       //delar de 1 segundo para evitar sobrecarga de datos
//         // }
//     })
// })
Deno.serve(app.fetch)       