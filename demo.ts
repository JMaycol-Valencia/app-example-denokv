//creacion de la bd con deno
const db = await Deno.openKv();

// //ejemplo creamos user, lo guardamos y lo solicitamos
// //creacion del user
// const user = 'jmaycolv'

// //guardamos con el metodo set que nos pide dos atributos, el key o campo dentro de un arryay [] y el dato a guardar
// const result = await db.set(['username'],user)
// console.log(result)

// //solicitamos el dato guardado
// const username = await db.get(['username'])
// console.log(username)

//ejemplo 1 de crear un contador
// const result = await db.set(["counter"],0)
// const counter = await db.get(["counter"])
// console.log(counter)

//ejemplo 2 de crear un contador
//await nos ayuda a manejar las promesas
//recuperamos el valor inicial
// const { value } = await db.get<number>(["counter"])
// //iniciamos el contador segun la comprobacion
// const newCounter = value == null ? 0 : value + 1
// //solicitamos el dato
// const result = await db.set(["counter"], newCounter)
// //lo mostramos
// console.log(result)

//Ejemplo 3
// //necesario solo para setear la primera vez no dejarlo
// //await db.set(["visits"],new Deno.KvU64(0n))  //0n -> BigInt
// await db
//     .atomic()
//     .sum(["visits"],1n)
//     .commit()

// const result = await db.get<Deno.KvU64>(["visits"])
// console.log(result)

//ejemplo 4 con objetos
// //creamos los objetos
// const facundoPreferences = {
//   username: "facundoCapua",
//   theme: "light",
//   language: "es-ES",
// };

// const maycolPreferences = {
//     username: "MaycolValencia",
//     theme: "dark",
//     language: "es-ES",
// };

// //guardamos los objetos
// await db.set(["preferences", "maycol"], maycolPreferences);
// await db.set(["preferences", "facundo"], facundoPreferences);

//los solicitaremos con get y los mostraremos (metodo por separado)
const maycolPreferences = await db.get(["preferences", "maycol"]);
const facundoPreferences = await db.get(["preferences", "facundo"]);

// //tambien podremos hacer un get para mas solicitudes y tener una 
// //mejor eficenciencia al momento de precio 
// const [
//     facundoPreferences,
//     maycolPreferences,
// ] = await db.getMany([
//     ["preferences","facundo"],
//     ["preferences","maycol"]
// ])

//podemos tener un db.list usando el prefijo que usaremos para obtener los datos de la lsita
const entries = db.list({prefix: ["preferences"]})
//usar await en el for
for await (const entry of entries){     // <- javascript
    console.log(entry)
}

console.log(maycolPreferences);
console.log(facundoPreferences);


await db.delete(["preferences","facundo"])