import supabase from './supabase-client';

function Header({ session }) {

  const logOut =  async () => {
    const { error } = await supabase.auth.signOut()
  };

  return (
    <>
      <header>
        <h1>Sales Team Dashboard</h1>
        {session && <button onClick={logOut}>Logout</button>}
      </header>
    </>
  );

}

export default Header;