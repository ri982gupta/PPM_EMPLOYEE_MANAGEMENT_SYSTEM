import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { CBadge } from "@coreui/react";
import { FaHome } from "react-icons/fa";
import HomeScreenPopUp from "./header/HomeScreenPopUp";
import axios from "axios";
import { environment } from "../environments/environment";

export const AppSidebarNav = ({ items }) => {
  const location = useLocation();
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [subMenueId, setSubMenueId] = useState("");
  const [subMenueName, setSubMenueName] = useState("");
  const [getHomeScreenId, setGetHomeScreenId] = useState([]);

  const getHomeScreen = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/CommonMS/master/getHomeScreen?loggedUserId=${loggedUserId}`,
    }).then((res) => {
      let data = res.data;
      setGetHomeScreenId(data);
    });
  };

  useEffect(() => {
    getHomeScreen();
  }, []);

  const navLink = (name, icon, badge, item) => {
    return (
      <>
        <div>
          {icon && icon}
          {name && name}
          {badge && (
            <CBadge color={badge.color} className="ms-auto">
              {badge.text}
            </CBadge>
          )}
          {/* <div>{item != undefined ? <FaHome /> : ""}</div> */}
        </div>
      </>
    );
  };

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <>
        <span className="navElem">
          <Component
            onClick={() => {
              let top = document.getElementsByClassName(
                "sidebar sidebar-fixed"
              )[0];
              if (top != undefined) {
                if (top.classList.contains("hide") == false) {
                  top.classList.add("hide");
                }
              }
            }}
            {...(rest.to &&
              !rest.items && {
                component: NavLink,
              })}
            key={parseInt(item["id"] !== undefined ? item?.id : index)}
            {...rest}
          >
            {navLink(name, icon, badge, item)}
          </Component>
          {item.id == getHomeScreenId.userActionId ? (
            <span
              className={
                item.id == getHomeScreenId.userActionId
                  ? "currentHome"
                  : "makeHome"
              }
            >
              <FaHome title="Home Page" />
            </span>
          ) : [
              1063, 273, 6, 1035, 404, 370, 963, 5, 416, 918, 412, 408, 1024,
              287, 1070, 819, 1026, 1022, 453, 317, 1059, 1072, 865, 913, 1029,
              898, 1074, 785, 875, 876, 871, 982, 788, 881, 872, 873, 424, 395,
              480, 757, 763, 478, 490, 940, 27, 413, 392, 744, 868, 223, 24, 21,
              14, 284,
            ].includes(item.id) || item.id == undefined ? (
            ""
          ) : (
            <span
              className={
                item.id == getHomeScreenId.userActionId
                  ? "currentHome"
                  : "makeHome"
              }
              onClick={() => {
                setSubMenueId(item.id);
                setSubMenueName(item.name);
                setVisible(true);
              }}
            >
              <FaHome title="Set As Home Page" />
            </span>
          )}
        </span>
      </>
    );
  };
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item;
    const Component = component;
    return (
      <span>
        <Component
          idx={
            item["id"] !== undefined
              ? String.fromCharCode(parseInt(65 + index)) + "" + item?.id
              : String.fromCharCode(parseInt(65 + index)) + "" + index
          }
          key={
            item["id"] !== undefined
              ? String.fromCharCode(parseInt(65 + index)) + "" + item?.id
              : String.fromCharCode(parseInt(65 + index)) + "" + index
          }
          toggler={navLink(name, icon)}
          visible={location.pathname.startsWith(to)}
          {...rest}
        >
          {item.items?.map((item, index) =>
            item.items ? navGroup(item, index) : navItem(item, index)
          )}
        </Component>
      </span>
    );
  };

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (
          <>{item.items ? navGroup(item, index) : navItem(item, index)}</>
        ))}
      {visible ? (
        <HomeScreenPopUp
          subMenueId={subMenueId}
          visible={visible}
          setVisible={setVisible}
          subMenueName={subMenueName}
        />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};
