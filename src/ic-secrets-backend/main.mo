import Nat "mo:base/Nat";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Array "mo:base/Array";

actor SecretsManager {

  type Secret = {
    encrypted : Text;
    name : Text;
  };

  var secrets = HashMap.HashMap<Principal, [Secret]>(10, Principal.equal, Principal.hash);

  // Store a new secret for the caller
  public shared(msg) func storeSecret(name: Text, encrypted: Text): async Text {
    let caller = msg.caller;
    let currentSecrets = secrets.get(caller);
    let newSecret: Secret = { encrypted; name };
    let updatedSecrets = switch (currentSecrets) {
      case (null) { [newSecret] };
      case (?list) { Array.append(list, [newSecret]) };
    };
    secrets.put(caller, updatedSecrets);
    return "Secret stored";
  };

  // Retrieve all secrets for the caller
  public shared(msg) func getSecrets(): async [Secret] {
    let caller = msg.caller;
    switch (secrets.get(caller)) {
      case (null) { [] };
      case (?list) { list };
    };
  };

  // Wipe all secrets for caller (for demo/reset)
  public shared(msg) func clearSecrets(): async Text {
    let caller = msg.caller;
    secrets.delete(caller);
    return "Secrets cleared";
  };
};
