/**
 * Created by Nidin Vinayakan on 31/03/17.
 */
///<reference path="../webassembly.d.ts" />

import * as fs from "fs";

function displayModExports(prompt: string, mod: WebAssembly.Module) {
  let exports = WebAssembly.Module.exports(mod);
  console.log(`${prompt} length=${exports.length}`);
  for (let i in exports) {
    let v = exports[i];
    console.log(`${prompt}[${i}] name=${v.name} kind=${v.kind}`);
  }
}

function displayModImports(prompt: string, mod: WebAssembly.Module) {
  let imports = WebAssembly.Module.imports(mod);
  console.log(`${prompt} length=${imports.length}`);
  for (let i in imports) {
    let v = imports[i];
    console.log(`${prompt}[${i}] name=${v.name} kind=${v.kind}`);
  }
}

function readFileAsync(filePath: string): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(new Uint8Array(data));
      }
    });
  });
}

// Table
let table = new WebAssembly.Table({element: "anyfunc", initial: 1, maximum: 10});
console.log(`table.length=${table.length}`);
console.log(`table.get(0)=${table.get(0)}`);
//table.set(0, function () {
//});
table.grow(1);

// Memory
let memory = new WebAssembly.Memory({initial: 2, maximum: 8});
console.log(`memory.grow(6)=${memory.grow(6)}`);
let u8 = new Uint8Array(memory.buffer);
u8[0] = 1;
u8[1] = 2;
console.log(`u8[0]=${u8[0]}`);
console.log(`u8[1]=${u8[1]}`);

let data = fs.readFileSync('./test/addTwo.wasm');
let wasmDataU8 = new Uint8Array(data);
console.log(`data.buffer.byteLength=${data.buffer.byteLength}`);
console.log(`wasmDataU8.length=${wasmDataU8.length}`);
console.log(`wasmDataU8[0]=${wasmDataU8[0].toString(16)}`);
console.log(`wasmDataU8[1]=${wasmDataU8[1].toString(16)}`);
console.log(`wasmDataU8[2]=${wasmDataU8[2].toString(16)}`);
console.log(`wasmDataU8[3]=${wasmDataU8[3].toString(16)}`);
console.log(`wasmDataU8[4]=${wasmDataU8[4].toString(16)}`);
console.log(`wasmDataU8[5]=${wasmDataU8[5].toString(16)}`);
console.log(`wasmDataU8[6]=${wasmDataU8[6].toString(16)}`);
console.log(`wasmDataU8[7]=${wasmDataU8[7].toString(16)}`);

// Validate
let valid = WebAssembly.validate(wasmDataU8);
console.log("wasmDataU8 is " + (valid ? "" : "not ") + "a valid wasm wasmModule");

// Module
let wasmModule = new WebAssembly.Module(wasmDataU8);
console.log(`wasmModule=${wasmModule}`);

// CustomSections
let nameSections = WebAssembly.Module.customSections(wasmModule, "name");
console.log(`Module contains ${nameSections.length} name sections`);
if (nameSections.length != 0) {
  console.log("Module contains a name section");
  console.log(nameSections[0]);
}

// Display Exports
displayModExports('wasmModule.exports', wasmModule);

// Display Imports
displayModImports('wasmModule.imports', wasmModule);

// Instance
let instance = new WebAssembly.Instance(wasmModule);
console.log(`instance=${instance}`);
console.log(`instance.exports=${instance.exports}`);
//displayExports('instance.exports', instance.exports);
console.log(`addTwo1(1,2)=${instance.exports.addTwo1(1,2)}`);

// Instantiate
//   Primary overload — taking wasm binary code
WebAssembly.instantiate(wasmDataU8).then((result: WebAssembly.ResultObject) => {
  console.log(`Primary overload mod=${result.module}`);
  console.log(`Primary overload inst=${result.instance}`);
  console.log(`Primary exec instance.exports..addTwo1(-1,1)=${result.instance.exports.addTwo1(-1,1)}`);
});

// Instantiate
//   Secondary overload — taking a Module object
WebAssembly.instantiate(wasmModule).then((instance: WebAssembly.Instance) => {
  console.log(`Secondary overload instance=${instance}`);
  console.log(`Secondary exec instance.exports..addTwo1(0,-1)=${instance.exports.addTwo1(0,-1)}`);
});

async function instantiateFile(filePath: string): Promise<WebAssembly.Instance> {
  console.log("instantiateFile:+ readFile");
  let instance = readFileAsync(filePath)
    .then(data => {
      console.log("instantiateFile fileRead:");
      console.log(`data.length=${data.length}`);
      console.log(`data[0]=${data[0].toString(16)}`);
      console.log(`data[1]=${data[1].toString(16)}`);
      console.log(`data[2]=${data[2].toString(16)}`);
      console.log(`data[3]=${data[3].toString(16)}`);
      console.log(`data[4]=${data[4].toString(16)}`);
      console.log(`data[5]=${data[5].toString(16)}`);
      console.log(`data[6]=${data[6].toString(16)}`);
      console.log(`data[7]=${data[7].toString(16)}`);

      // Compile
      console.log("instantiateFile compile:");
      return Promise.resolve(WebAssembly.compile(data));
    })
    .then((mod: WebAssembly.Module) => {
      console.log("instantiateFile compiled return Module:");
      return Promise.resolve(WebAssembly.instantiate(mod));
    });
  console.log("instantiateFile:-");
  return instance;
}

// Use instantiateFile
console.log("call instantiateFile");
instantiateFile("./test/addTwo.wasm").then(inst => {
  console.log(`done instantiateFile inst=${inst}`)
  console.log(`exec inst.exports..addTwo1(0,0)=${inst.exports.addTwo1(0,0)}`);
});
