import React, { useContext, useEffect } from "react";
import { useState } from "react";

import logo from "../images/gemini.png";
import avatar from "../images/avt.png";
import button from "../images/send-icon.png";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { langContext } from "../Contexts/langContext";


const Main = () => {

  const {isDarkMode, setIsDarkMode} = useContext(langContext);
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isNothing, setIsNothing] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const apiKey = "AIzaSyAGOM-gC9P3YQEPXOEauQ_GgfQtlXCNIzM";

  const fetchData = async (values) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: values }],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      const apiResponse = data.candidates[0].content.parts[0].text;
      const responseArray = apiResponse.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i % 2 === 0) {
          newResponse += responseArray[i];
        } else {
          newResponse += `<b>${responseArray[i]}</b>`;
        }
      }
      let newResponse2 = newResponse.split("*").join("<br/>");
      setResult(newResponse2);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClick = () => {
    setIsNothing(false);
    if (value.trim()) {
      fetchData(value);
      setMessageList((messageList) => [
        ...messageList,
        { isUserMessage: true, message: value, avatar: avatar },
      ]);
    }

    setValue("");
  };

  const handleChange = (e) => {
    if (e.target.value !== "") {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
    setValue(e.target.value);
  };

  useEffect(() => {
    if (result) {
      setMessageList((prevMessages) => [
        ...prevMessages,
        { isUserMessage: false, message: result, avatar: logo },
      ]);
    }
  }, [result]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    console.log(isDarkMode);
    
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className={`w-full min-h-screen pl-[200px] flex pt-2 ${isDarkMode ? 'bg-black text-white' : ""}`}>
      <div className="w-[10%]">
        <div className="text-center">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            type="button"
            onClick={toggleDrawer}
          >
            Show
          </button>
        </div>

        <div
          className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white dark:bg-gray-800`}
          tabIndex="-1"
          aria-labelledby="drawer-navigation-label"
        >
          <h5
            id="drawer-navigation-label"
            className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
          >
            Menu
          </h5>
          <button
            type="button"
            data-drawer-hide="drawer-navigation"
            aria-controls="drawer-navigation"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close menu</span>
          </button>

          <div className="py-4 overflow-y-auto">
            <div className="space-y-2 font-medium">

              <span className="ms-3">Recent</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] ml-4 ">
        <div className="flex items-center justify-between">
          <p className="text-[20px]">Gemini</p>
          <div className="flex">
            <button className="text-[24px]" onClick={() => toggleDarkMode ()}>
              {isDarkMode ?  <SunOutlined/> :  <MoonOutlined/>}
            </button>
            
            <img
              className="rounded-full mx-4"
              src={avatar}
              alt="Avatar"
              width="40"
              height="40"
            />
          </div>
        </div>
        <div className="flex items-center fixed w-full bottom-4 pr-[200px] ">
          <input
            className={`focus:outline-none bottom-4 border-none px-6 py-4 rounded-[50px]  left-[30%] w-[60%] ${isDarkMode ? "text-white bg-[#0e0f0f]" : "bg-[#d4e2f4]"} `}
            type="text"
            onChange={handleChange}
            placeholder="Ask me everything..."
            value={value}
          />
          {isEmpty ? (
            ""
          ) : (
            <img
              className="absolute right-[50%] w-[24px] h-[24px] hover:opacity-70 hover:cursor-pointer"
              src={button}
              alt="send"
              onClick={handleClick}
            />
          )}
        </div>
        <div className={`flex-1 overflow-y-auto pb-[100px] ${isDarkMode ? "bg-black text-white" : "" }`}>
          {!isNothing ? (
            messageList.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.isUserMessage
                    ? "text-right p-3 mt-7 mb-7 w-fit rounded-md font-medium pr-[200px]"
                    : "text-left rounded-md pr-[200px]"
                }`}
              >
                {message.isUserMessage ? (
                  <div className="flex justify-center items-center">
                    <img
                      className="rounded-full mr-4"
                      src={message.avatar}
                      alt="Avatar"
                      width="40"
                      height="40"
                    />
                    <p>{message.message}</p>
                  </div>
                ) : (
                  <div className="flex items-start ml-2">
                    <img
                      className="mr-4"
                      src={message.avatar}
                      alt="Avatar"
                      width="40"
                      height="40"
                    />
                    <p dangerouslySetInnerHTML={{ __html: message.message }} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <span className="block font-medium text-[32px] mt-[20%] mx-[20%]">
              Hello, How can i help you?
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
