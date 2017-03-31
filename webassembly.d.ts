interface NativeError {

}

/**
 * WebAssembly v1 (MVP) declaration file for TypeScript
 * Author : 01alchemist (https://twitter.com/01alchemist)
 */
declare namespace WebAssembly {

    /**
     * WebAssembly.Module
     **/
    interface Module {
        readonly [Symbol.toStringTag]: "Module";
    }

    interface ModuleConstructor {
        readonly prototype: Module;
        new(bufferSource: ArrayBuffer | Uint8Array): Module;
        customSections(module: Module, sectionName: string): ArrayBuffer[];
        exports(module: Module): {
            name: string;
            kind: string;
        }[];
        imports(module: Module): {
            module: string;
            name: string;
            kind: string;
        }[];
    }
    const Module: ModuleConstructor;

    /**
     * WebAssembly.Instance
     **/
    interface Instance {
        readonly exports: any;
        readonly [Symbol.toStringTag]: "Instance";
    }

    interface InstanceConstructor {
        readonly prototype: Instance;
        new(module: Module, importObject?: any): Instance;
    }
    const Instance: InstanceConstructor;

    /**
     * WebAssembly.Memory
     * Note: A WebAssembly page has a constant size of 65,536 bytes, i.e., 64KiB.
     **/
    interface MemoryDescriptor {
        initial: number;
        maximum?: number;
    }

    interface Memory {
        readonly buffer: ArrayBuffer;
        grow(numPages: number): number;
        readonly [Symbol.toStringTag]: "Memory";
    }

    interface MemoryConstructor {
        readonly prototype: Memory;
        new (memoryDescriptor: MemoryDescriptor): Memory;
    }
    const Memory: MemoryConstructor;

    /**
     * WebAssembly.Table
     **/
    interface TableDescriptor {
        element: "anyfunc",
        initial: number;
        maximum?: number;
    }

    interface Table {
        readonly length: number;
        get(index: number): Function;
        grow(numElements: number): number;
        set(index: number, value: Function): void;
        readonly [Symbol.toStringTag]: "Table";
    }

    interface TableConstructor {
        readonly prototype: Table;
        new (tableDescriptor: TableDescriptor): Table;
    }
    const Table: TableConstructor;


    const CompileError: NativeError;
    const LinkError: NativeError;
    const RuntimeError: NativeError;

    function compile(bufferSource: ArrayBuffer | Uint8Array): Promise<Module>;

    interface ResultObject {
        module:Module;
        instance:Instance;
    }

    function instantiate(bufferSource: ArrayBuffer | Uint8Array, importObject?: any): Promise<ResultObject>;
    function instantiate(module: Module, importObject?: any): Promise<Instance>;

    function validate(bufferSource: ArrayBuffer | Uint8Array):boolean;
}