/**
 * WebAssembly v1 (MVP) declaration file for TypeScript
 * Definitions by: 01alchemist (https://twitter.com/01alchemist)
 */
declare namespace WebAssembly {
    /**
     * WebAssembly.Module
     **/
    class Module {
        constructor (bufferSource: ArrayBuffer | Uint8Array);

        static customSections(module: Module, sectionName: string): ArrayBuffer[];
        static exports(module: Module): {
            name: string;
            kind: string;
        }[];
        static imports(module: Module): {
            module: string;
            name: string;
            kind: string;
        }[];
    }

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

    /**
     * Errors
     */
    interface CompileError extends Error {
        readonly fileName: string;
        readonly lineNumber: string;
        readonly columnNumber: string;
        toString(): string;
    }
    interface CompileErrorConstructor {
        readonly prototype: CompileError;
        new (message?:string, fileName?:string, lineNumber?:number):CompileError;
    }
    const CompileError: CompileErrorConstructor;

    interface LinkError extends Error {
        readonly fileName: string;
        readonly lineNumber: string;
        readonly columnNumber: string;
        toString(): string;
    }
    interface LinkErrorConstructor {
        readonly prototype: LinkError;
        new (message?:string, fileName?:string, lineNumber?:number):LinkError;
    }
    const LinkError: LinkErrorConstructor;

    interface RuntimeError extends Error {
        readonly fileName: string;
        readonly lineNumber: string;
        readonly columnNumber: string;
        toString(): string;
    }
    interface RuntimeErrorConstructor {
        readonly prototype: RuntimeError;
        new (message?:string, fileName?:string, lineNumber?:number):RuntimeError;
    }
    const RuntimeError: RuntimeErrorConstructor;

    function compile(bufferSource: ArrayBuffer | Uint8Array): Promise<Module>;

    interface ResultObject {
        module: Module;
        instance: Instance;
    }

    function instantiate(bufferSource: ArrayBuffer | Uint8Array, importObject?: any): Promise<ResultObject>;
    function instantiate(module: Module, importObject?: any): Promise<Instance>;

    function validate(bufferSource: ArrayBuffer | Uint8Array): boolean;
}
