import React, { useContext, useEffect } from "react";
import { useState } from "react";

import logo from "../images/gemini.png";
import avatar from "../images/avt.png";
import button from "../images/send-icon.png";
import { BarsOutlined, MessageOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { langContext } from "../Contexts/langContext";
import { message } from "antd";

const Main = () => {
  const { isDarkMode, setIsDarkMode } = useContext(langContext);
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isNothing, setIsNothing] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentText, setCurrentText] = useState("");

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
            contents: [{ parts: [{ text: values }] }],
          }),
        }
      );
      const data = await response.json();
      const apiResponse = data.candidates[0].content.parts[0].text;

      // Kiểm tra apiResponse có phải là chuỗi không
      if (typeof apiResponse !== "string") {
        console.error("API response is not a string:", apiResponse);
        return; // Nếu không phải chuỗi, dừng lại
      }

      const responseArray = apiResponse.split("**");
      let newResponse = "";

      // Thêm HTML vào các phần tử
      for (let i = 0; i < responseArray.length; i++) {
        if (i % 2 === 0) {
          newResponse += responseArray[i];
        } else {
          newResponse += `<b>${responseArray[i]}</b>`;
        }
      }
      let newResponse2 = newResponse.split("*").join("<br/>");
      setResult(newResponse2);

      /*  setResult(newResponse2); // Cập nhật kết quả sau khi đã tạo HTML
      setIsTyping(true);
      setCurrentText(""); // Đặt lại currentText
  
      let index = 0;
      const typingInterval = setInterval(() => {
        setCurrentText((prev) => prev + newResponse2.charAt(index));
        index++;
  
        if (index === newResponse2.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 30); */
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
        {
          id: messageList.length,
          isUserMessage: true,
          message: value,
          avatar: avatar,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ]);
    }
    setIsEmpty(true);
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
        {
          id: messageList.length,
          isUserMessage: false,
          message: result,
          avatar: logo,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ]);
    }
  }, [result]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const truncateMsg = (message, maxLength = 15) => {
    const truncate = message
      .split(" ")
      .slice(0, maxLength)
      .join(" ");
    return message.length > 10
      ? message.charAt(0).toUpperCase() + truncate.slice(1, maxLength) + "..."
      : message.charAt(0).toUpperCase() + truncate.slice(1, maxLength);
  };

  const handleSidebarClick = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleKeyDown = (e) => {
    if(e.keyCode === 13){
        handleClick()
    }
  }

  return (
    <div
      className={`w-full min-h-screen pl-[200px] flex pt-2 ${
        isDarkMode ? "bg-[#0e0f0f] text-white" : ""
      }`}
    >
      <div className={"w-[10%]"}>
        <div
            className={`fixed top-0 left-0 z-40 h-screen p-4 transition-all duration-300 ${
              isDrawerOpen ? "w-64 translate-x-0" : "w-[200px] -translate-x-0"
            } ${
              isDarkMode
                ? "bg-[#383c3c] text-white border-r border-gray-700"
                : "bg-white border-r border-gray-300"
            }`}
        >
          <button
            type="button"
            onClick={toggleDrawer}
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
          {messageList
            .filter((message) => message.isUserMessage === true)
            .map((message, index) => (
              <div
                className="flex items-center justify-between mt-2 hover:cursor-pointer hover:opacity-70"
                key={message.id || index}
                onClick={() => handleSidebarClick(message.id)}
              >
                <span>
                  <MessageOutlined className="mr-2" />
                  {truncateMsg(message.message)}
                </span>
                <span className={` text-[12px] ${!isDrawerOpen ? 'hidden' : "" }`}>{message.time}</span>
              </div>
            ))}
        </div>

        {/*  */}
{/* 
        <div
          className={`fixed top-0 left-0 z-40 h-screen p-4 transition-all duration-300 ${
            isDrawerOpen ? "w-6 translate-x-0" : "w-[50px] -translate-x-0"
          } ${isDarkMode ? "bg-[#383c3c] text-white" : "bg-white"}`}
          
        >
          <BarsOutlined />
        </div> */}

        {/*  */}
      </div>
      <div className="w-[90%] ml-4 ">
        <div className="flex items-center justify-between">
          <p className="text-[20px]">Gemini</p>
          <div className="flex">
            <button className="text-[24px]" onClick={() => toggleDarkMode()}>
              {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
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
        <div className="flex items-center fixed w-full bottom-10 pr-[200px] ">
          <input
            className={`focus:outline-none bottom-4 border-none px-6 py-4 rounded-[50px]  left-[30%] w-[70%] ${
              isDarkMode ? "text-white bg-[#3a4040]" : "bg-[#d4e2f4]"
            } `}
            type="text"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            value={value}
          />

          {isEmpty ? (
            ""
          ) : (
            <img
              className="absolute right-[40%] w-[24px] h-[24px] hover:opacity-70 hover:cursor-pointer"
              src={button}
              alt="send"
              onClick={handleClick}
            />
          )}
        </div>
        <div className="fixed bottom-2 left-0 w-full text-center py-2 font-medium">
          Made by Eddie
        </div>
        <div
          className={`flex-1 overflow-y-auto pb-[100px] ${
            isDarkMode ? "bg-[#0e0f0f] text-white" : ""
          }`}
        >
          {!isNothing ? (
            messageList.map((message, index) => (
              <div
                key={index}
                id={message.id}
                className={`${
                  message.isUserMessage
                    ? "text-right p-3 mt-7 mb-7 w-fit rounded-md font-medium ml-[50px] pr-[250px]"
                    : "text-left rounded-md pr-[250px] pl-[50px]"
                }`}
              >
                {message.isUserMessage ? (
                  <div className="flex justify-end items-center">
                    <img
                      className="rounded-full mr-4 h-[40px]"
                      src={message.avatar}
                      alt="Avatar"
                      width="40"
                      height="40"
                    />
                    <div className="text-left">
                      <p>{message.message}</p>
                      <p className="block text-[12px]">{message.time}</p>
                    </div>
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
                    <div className="text-left">
                      <p
                        dangerouslySetInnerHTML={{ __html: message.message }}
                      />

                      <p className="block text-[12px]">{message.time}</p>
                    </div>
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
