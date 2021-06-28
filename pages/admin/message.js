import useSWR from "swr";
import Head from "next/head";

const HeadPage = () => (
  <Head>
    <title>User Messages</title>
  </Head>
);

const Message = (props) => {
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

  return (
    <div>
      <HeadPage />
      {data.data.map((item) => {
        return (
          <div className="display-message" key={item._id}>
            <h5>{item._id}</h5>
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
    </div>
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
