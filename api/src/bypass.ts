import v8 from "node:v8";

Object.defineProperty(v8, "startupSnapshot", {
    value: {
        isBuildingSnapshot: () => false,
    },
    writable: true,
    configurable: true,
});