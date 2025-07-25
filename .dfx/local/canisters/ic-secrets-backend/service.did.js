export const idlFactory = ({ IDL }) => {
  const Secret = IDL.Record({ 'name' : IDL.Text, 'encrypted' : IDL.Text });
  const SharedSecret = IDL.Record({
    'sharedBy' : IDL.Principal,
    'name' : IDL.Text,
    'encrypted' : IDL.Text,
    'sharedWith' : IDL.Principal,
  });
  return IDL.Service({
    'clearSecrets' : IDL.Func([], [IDL.Text], []),
    'clearSharedSecrets' : IDL.Func([], [IDL.Text], []),
    'getSecrets' : IDL.Func([], [IDL.Vec(Secret)], []),
    'getSharedSecrets' : IDL.Func([], [IDL.Vec(SharedSecret)], []),
    'shareSecret' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'storeSecret' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
