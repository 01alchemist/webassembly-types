/**
 * Created by Nidin Vinayakan on 31/03/17.
 */
///<reference path="../webassembly.d.ts" />

let source: Uint8Array = new Uint8Array(1);

//Table
let table = new WebAssembly.Table({element: "anyfunc", initial: 1, maximum: 10});
console.log(table.length);
table.get(0)();
table.set(0, function () {
});
table.grow(1);

//Memory
let memory = new WebAssembly.Memory({initial: 2, maximum: 256});
console.log(memory.grow(512));
let u8 = new Uint8Array(memory.buffer);
console.log(u8);

//Module
let module = new WebAssembly.Module(source);
//customSections
let nameSections = WebAssembly.Module.customSections(module, "name");
if (nameSections.length != 0) {
    console.log("Module contains a name section");
    console.log(nameSections[0]);
}
//exports
console.log(WebAssembly.Module.exports(module).length);
console.log(WebAssembly.Module.exports(module)[0].name);
console.log(WebAssembly.Module.exports(module)[0].kind);
//imports
console.log(WebAssembly.Module.imports(module).length);
console.log(WebAssembly.Module.imports(module)[0].module);
console.log(WebAssembly.Module.imports(module)[0].name);
console.log(WebAssembly.Module.imports(module)[0].kind);

//Instance
let instance = new WebAssembly.Instance(module);
console.log(instance.exports.exported_func());


let bytes = new ArrayBuffer(1);//dummy bytes
//validate
let valid = WebAssembly.validate(bytes);
console.log("The given bytes are " + (valid ? "" : "not ") + "a valid wasm module");

//compile
WebAssembly.compile(bytes).then((module: WebAssembly.Module) => {
    console.log(module);
});

//instantiate
//Primary overload — taking wasm binary code
WebAssembly.instantiate(bytes).then((result: WebAssembly.ResultObject) => {
    console.log(result.module);
    console.log(result.instance);
});
//Secondary overload — taking a module object instance
WebAssembly.instantiate(module).then((instance: WebAssembly.Instance) => {
    console.log(instance);
});
