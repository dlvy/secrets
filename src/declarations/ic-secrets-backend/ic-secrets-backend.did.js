export const idlFactory = ({ IDL }) => {
  const Secret = IDL.Record({ 'name' : IDL.Text, 'encrypted' : IDL.Text });
  return IDL.Service({
    'clearSecrets' : IDL.Func([], [IDL.Text], []),
    'getSecrets' : IDL.Func([], [IDL.Vec(Secret)], []),
    'storeSecret' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
