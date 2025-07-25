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

  type SharedSecret = {
    encrypted : Text;
    name : Text;
    sharedBy : Principal;
    sharedWith : Principal;
  };

  var secrets = HashMap.HashMap<Principal, [Secret]>(10, Principal.equal, Principal.hash);
  var sharedSecrets = HashMap.HashMap<Principal, [SharedSecret]>(10, Principal.equal, Principal.hash);

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

  // Share a secret with another principal
  public shared(msg) func shareSecret(name: Text, encryptedForRecipient: Text, recipientPrincipal: Principal): async Text {
    let caller = msg.caller;
    let currentSharedSecrets = sharedSecrets.get(recipientPrincipal);
    let newSharedSecret: SharedSecret = { 
      encrypted = encryptedForRecipient; 
      name = name; 
      sharedBy = caller; 
      sharedWith = recipientPrincipal 
    };
    let updatedSharedSecrets = switch (currentSharedSecrets) {
      case (null) { [newSharedSecret] };
      case (?list) { Array.append(list, [newSharedSecret]) };
    };
    sharedSecrets.put(recipientPrincipal, updatedSharedSecrets);
    return "Secret shared successfully";
  };

  // Get secrets shared with the caller
  public shared(msg) func getSharedSecrets(): async [SharedSecret] {
    let caller = msg.caller;
    switch (sharedSecrets.get(caller)) {
      case (null) { [] };
      case (?list) { list };
    };
  };

  // Clear all shared secrets for caller
  public shared(msg) func clearSharedSecrets(): async Text {
    let caller = msg.caller;
    sharedSecrets.delete(caller);
    return "Shared secrets cleared";
  };
};
