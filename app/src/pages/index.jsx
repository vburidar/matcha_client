import api from '../api';

function HomePage({ users }) {
  return (
    <div>
      <div>Users :</div>
      {users && users.map((user) => (
        <ul key={user.id}>
          <li>Login: { user.login }</li>
          <li>Email: { user.email }</li>
          <li>Surname: { user.surname }</li>
          <li>Name: { user.name }</li>
        </ul>
      ))}
    </div>
  );
}

HomePage.getInitialProps = async () => {
  try {
    const res = await api.get('users');
    return {
      users: res.data,
    };
  } catch (error) {
    return { error: 'error' };
  }
};

export default HomePage;
