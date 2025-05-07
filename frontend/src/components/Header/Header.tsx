import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { observer } from "mobx-react-lite";
import { authStore } from "../../stores/authStore";

import logo from "/logo.svg";
import "./Header.scss";

const Header = observer(() => {
  const handleLogout = () => {
    authStore.logout();
    alert("Вы вышли из аккаунта!");
  };

  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="logo" />
        TasksHub
      </Link>
      <nav>
        <ul>
          <li>
            <HashLink smooth to="/#proces">
              Процесс
            </HashLink>
          </li>
          <li>
            <HashLink smooth to="/#feedback">
              Отзывы
            </HashLink>
          </li>
        </ul>
      </nav>
      <div className="btns">
        <Link className="btn" to="/p">
          Использовать
        </Link>
        {authStore.user
          ? <button onClick={handleLogout} className="btn logout-btn">authStore.user.username</button>
          : <Link to="/login" className="btn">Войти</Link>
        }
      </div>
    </header>
  );
});

export default Header;
