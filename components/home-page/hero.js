import classes from "./hero.module.css";
import Image from "next/image";

const Hero = () => {
  return (
    <section className={classes.hero}>
      <div className={classes.image}>
        <Image
          src="/images/site/sridhar.jpg"
          alt="An image showing Sai"
          height={350}
          width={300}
        />
      </div>
      <h1>Hi, I'm Sai Sridhar</h1>
      <p>I blog about Anime and WebDev (mainly about Frontend)</p>
    </section>
  );
};

export default Hero;
