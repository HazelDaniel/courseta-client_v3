import "~/styles/creators-courses.css";
export const CreatorsCourses: React.FC = () => {
  return (
    <section className="creator_courses_section">
      <h2 className="section_title">My courses</h2>
      <div className="course_table_head">
        <div className="table_head_left">
          <h3>title</h3>
          <h3>Date Created</h3>
          <h3>Date Updated</h3>
          <h3>Tags</h3>
        </div>
        <div className="table_head_right">
          <button>
            <span>
              <svg>
                <use xlinkHref="#add"></use>
              </svg>
            </span>
            Add Course
          </button>
        </div>
      </div>
      <ul className="course_table_body">
        {/* has state */}
        <li className="course_table_entry">
          <div className="entry_left">
            <div className="course_avatar">
              <img
                src="/images/blockchain.jpg"
                alt="image of a course entry in a list of courses created by a course creator"
              />
              <p>introductory course to blockchain</p>
            </div>

            <p className="date_text">12/20/2024</p>
            <p className="date_text">15/08/2024</p>
            <p className="tags">computer, networks, operating systems</p>
          </div>
          <div className="entry_right">
            <button>
              <svg>
                <use xlinkHref="#edit"></use>
              </svg>
            </button>
            <button className="archive_button">
              <svg>
                <use xlinkHref="#archive"></use>
              </svg>
            </button>
            <button>
              <svg>
                <use xlinkHref="#trash"></use>
              </svg>
            </button>
          </div>
        </li>

        <li className="course_table_entry archived">
          <div className="entry_left">
            <div className="course_avatar">
              <img
                src="/images/blockchain.jpg"
                alt="image of a course entry in a list of courses created by a course creator"
              />
              <p>introductory course to blockchain</p>
            </div>

            <p className="date_text">12/20/2024</p>
            <p className="date_text">15/08/2024</p>
            <p className="tags">computer, networks, operating systems</p>
          </div>
          <div className="entry_right">
            <button>
              <svg>
                <use xlinkHref="#edit"></use>
              </svg>
            </button>
            <button className="archive_button">
              <svg>
                <use xlinkHref="#archive"></use>
              </svg>
            </button>
            <button>
              <svg>
                <use xlinkHref="#trash"></use>
              </svg>
            </button>
          </div>
        </li>
      </ul>

      <div className="course_table_navigation">
        <button>
          <span>
            <svg>
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </span>{" "}
          previous
        </button>

        <button className="flipped">
          next
          <span>
            <svg>
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </span>{" "}
        </button>
      </div>
    </section>
  );
};

export default CreatorsCourses;
