import dns from "node:dns";
import { syncBuiltinESMExports } from "node:module";

const originalLookup = dns.lookup.bind(dns);
dns.lookup = function lookup(hostname, options, callback) {
  if (hostname !== "e2e-api.internal") {
    return Reflect.apply(originalLookup, dns, arguments);
  }

  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  const address = { address: "127.0.0.1", family: 4 };
  queueMicrotask(() => {
    if (options?.all) callback(null, [address]);
    else callback(null, address.address, address.family);
  });
};
syncBuiltinESMExports();
