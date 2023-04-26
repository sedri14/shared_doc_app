import { useEffect } from "react";
import onlineUserImg from "../user-logo.png"

const OnlineUsers = (props) => {
  const { onlineUsers } = props;

  useEffect(() => {
    console.log("Online users changed:", onlineUsers);
    console.log("There are " + onlineUsers.length + " connected users");
  }, [onlineUsers]);

  return (
    <section className="favorites">
      <div className="favorites-content">
        <h5>Online Users</h5>
        <div className="favorites-container">
          {onlineUsers.map((onlineUser) => {
            return (
              <div key={onlineUser} className="online-user">
                <img src={onlineUserImg} alt="online user" className="favorites-img img"></img>
                <div className="connected-user">{onlineUser}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OnlineUsers;
