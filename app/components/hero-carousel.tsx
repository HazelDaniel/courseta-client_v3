import carouselStyles from "~/styles/hero-carousel.module.css";

export const HeroCarousel: React.FC = () => {
  return (
    <div className={carouselStyles["hero_carousel"]}>
      <ul>
        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_img"]
          }
        >
          <img
            src="/images/compressed/compressed_image_35.jpg"
            alt="testimonial card"
            loading="lazy"
          />
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_card"]
          }
        >
          <div>
            <div className={carouselStyles["cec_top"]}>
              <img
                src="/images/compressed/compressed_image_30.jpg"
                alt="avatar image of a social card component"
                loading="lazy"
              />
              <div>
                <h3>daniel emmanuel</h3>
                <p>olaleyedaniel2000@gmail.com</p>
              </div>
            </div>
            <div className={carouselStyles["cec_bottom"]}>
              <p>
                The content is rich, engaging, and tailored to meet the needs of
                both beginners and advanced learners. The interactive lessons
                and real-time feedback have not only helped me grasp complex
                topics quickly but have also kept me motivated throughout my
                learning journey. One of the platform's strongest features is
                its intuitive design, which makes navigating through courses
                seamless.
              </p>
            </div>
          </div>
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_img"]
          }
        >
          <img
            src="/images/compressed/compressed_image_35.jpg"
            alt="testimonial card"
            loading="lazy"
          />
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_card"]
          }
        >
          <div>
            <div className={carouselStyles["cec_top"]}>
              <img
                src="/images/compressed/compressed_image_30.jpg"
                alt="avatar image of a social card component"
                loading="lazy"
              />
              <div>
                <h3>daniel emmanuel</h3>
                <p>olaleyedaniel2000@gmail.com</p>
              </div>
            </div>
            <div className={carouselStyles["cec_bottom"]}>
              <p>
                The content is rich, engaging, and tailored to meet the needs of
                both beginners and advanced learners. The interactive lessons
                and real-time feedback have not only helped me grasp complex
                topics quickly but have also kept me motivated throughout my
                learning journey. One of the platform's strongest features is
                its intuitive design, which makes navigating through courses
                seamless.
              </p>
            </div>
          </div>
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_img"]
          }
        >
          <img
            src="/images/compressed/compressed_image_35.jpg"
            alt="testimonial card"
            loading="lazy"
          />
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_card"]
          }
        >
          <div>
            <div className={carouselStyles["cec_top"]}>
              <img
                src="/images/compressed/compressed_image_30.jpg"
                alt="avatar image of a social card component"
                loading="lazy"
              />
              <div>
                <h3>daniel emmanuel</h3>
                <p>olaleyedaniel2000@gmail.com</p>
              </div>
            </div>
            <div className={carouselStyles["cec_bottom"]}>
              <p>
                The content is rich, engaging, and tailored to meet the needs of
                both beginners and advanced learners. The interactive lessons
                and real-time feedback have not only helped me grasp complex
                topics quickly but have also kept me motivated throughout my
                learning journey. One of the platform's strongest features is
                its intuitive design, which makes navigating through courses
                seamless.
              </p>
            </div>
          </div>
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_img"]
          }
        >
          <img
            src="/images/compressed/compressed_image_35.jpg"
            alt="testimonial card"
            loading="lazy"
          />
        </li>

        <li
          className={
            carouselStyles["carousel_entry"] +
            " " +
            carouselStyles["carousel_entry_card"]
          }
        >
          <div>
            <div className={carouselStyles["cec_top"]}>
              <img
                src="/images/compressed/compressed_image_30.jpg"
                alt="avatar image of a social card component"
                loading="lazy"
              />
              <div>
                <h3>daniel emmanuel</h3>
                <p>olaleyedaniel2000@gmail.com</p>
              </div>
            </div>
            <div className={carouselStyles["cec_bottom"]}>
              <p>
                The content is rich, engaging, and tailored to meet the needs of
                both beginners and advanced learners. The interactive lessons
                and real-time feedback have not only helped me grasp complex
                topics quickly but have also kept me motivated throughout my
                learning journey. One of the platform's strongest features is
                its intuitive design, which makes navigating through courses
                seamless.
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
