import useSWR from "swr";
import Head from "next/head";
import Notification from "../../components/ui/notification";
import { useState } from "react";

const HeadPage = () => (
  <Head>
    <title>User Messages</title>
  </Head>
);

const Message = (props) => {
  const [requestStatus, setRequestStatus] = useState();
  const [requestError, setRequestError] = useState();

  if (props.hasError) {
    return (
      <div>
        <HeadPage />
        <h1 style={{ fontSize: "3rem", textAlign: "center" }}>
          YOU ARE NOT AN ADMIN
        </h1>
      </div>
    );
  }

  const getData = async (key) => {
    const response = await fetch(key);
    return await response.json();
  };

  const { data, error } = useSWR("/api/message", getData);

  if (!error && !data) {
    return (
      <div style={{ textAlign: "center" }}>
        <HeadPage />
        <h2>Loading...</h2>;
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center" }}>
        <HeadPage />
        <h1 style={{ fontSize: "3rem", textAlign: "center" }}>ERROR</h1>
        <h4>{`${error}`}</h4>
      </div>
    );
  }

  const deleteMessageHandler = async (messageId) => {
    setRequestStatus("pending");
    const response = await fetch("/api/message", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageId,
      }),
    }).then((resp) => resp.json());

    const temp = response.resp.deletedCount;

    if (temp === 0) {
      setRequestStatus("error");
      setRequestError("ID not found");
    } else {
      setRequestStatus("success");
      /* window.location.reload() */
    }
  };

  if (requestStatus === "success" || requestStatus === "error") {
    const timer = setTimeout(() => {
      setRequestError(null);
      setRequestStatus(null);
      clearTimeout(timer);
    }, 3000);
  }

  let notification;

  switch (requestStatus) {
    case "pending":
      notification = {
        status: "pending",
        title: "Sending Request...",
        message: "Trying to delete Message!",
      };
      break;

    case "success":
      notification = {
        status: "success",
        title: "Success!",
        message: "Message Deleted Successfully!",
      };
      break;

    case "error":
      notification = {
        status: "error",
        title: "Error!",
        message: requestError,
      };
      break;

    default:
      null;
  }

  return (
    <section style={{ padding: "1rem" }}>
      <HeadPage />
      {data.data.map((item) => {
        return (
          <div className="display-message" key={item._id}>
            <div className="top-display">
              <h5>{item.date}</h5>
              <img
                src="/trash-fill.svg"
                alt="delete"
                onClick={() => deleteMessageHandler(item._id)}
              />
            </div>
            <div>
              <div>
                Name:&nbsp;&nbsp;&nbsp; <h3>{item.name}</h3>
              </div>
              <div>
                Email:&nbsp;&nbsp;&nbsp; <h3>{item.email}</h3>
              </div>
            </div>

            <p>{item.message}</p>
          </div>
        );
      })}
      {notification && <Notification {...notification} />}
    </section>
  );
};

export default Message;

export async function getServerSideProps(context) {
  const { key } = context.query;

  if (key !== "bankai") {
    return {
      props: {
        hasError: true,
      },
    };
  }

  return {
    props: {
      hasError: false,
    },
  };
}
