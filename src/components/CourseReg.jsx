import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import axios from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { BACKEND_URL } from "../constants";
import { Modal } from "antd";
import CourseModal from "./CourseModal";
import "./courseReg.css";
import { useAuth0 } from "@auth0/auth0-react";

const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const fetcher = (url) => axios.get(url).then((res) => res.data);
let courses = "";

const CourseReg = (props) => {
  const { getAccessTokenSilently } = useAuth0();
  const studentData = props.studentData;
  const [courses, setCourse] = useState(""); //used as a query param
  const { data: indexData } = useGetIndexData(courses);
  const [courseName, setCourseName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseData, setCourseData] = useState({});
  // add course function: add courses to query to backend and add it to courseIndex to be transferred to other components
  const addCourse = () => {
    let course_code = prompt("Please enter course code", "");
    if (courses.length === 0) {
      setCourse(course_code);
    } else {
      setCourse(courses + `+${course_code}`);
    }
    let course_index = {
      ...props.courseIndex,
    };
    course_index[course_code] = undefined;
    props.setCourseIndex(course_index);
    setCourseName(course_code);
  };

  const deleteCourse = () => {
    let course_index = {
      ...props.courseIndex,
    };
    let courses = Object.keys(props.courseIndex);
    let course_code = prompt("Please enter course code", "");
    if (!courses.length) {
      alert("There is no courses to delete");
    } else if (courses.indexOf(course_code) !== -1 || course_code === "") {
      delete course_index[course_code];
      console.log(course_code);
    } else {
      alert(`${course_code} is present in your current courses`);
    }
    props.setCourseIndex(course_index);
    let a = courses.indexOf(course_code);
    courses.splice(a, 1);
    setCourse(courses.join("+"));
    console.log(courses);
  };

  const handleChange = (e, course) => {
    e.preventDefault();
    let course_index = { ...props.courseIndex };
    console.log(course_index);
    course_index[course.course_code] =
      course.course_indices[e.target.value].index_code;
    //console.log(course_index);
    props.setCourseIndex(course_index);
    console.log(course_index);
  };

  const registerCourse = async (e) => {
    e.preventDefault();
    const accessToken = await getAccessTokenSilently({
      audience: `${audience}`,
      scope: "read:current_user",
    });
    let indexes = Object.values(props.courseIndex);
    let courses = Object.keys(props.courseIndex);

    indexes = indexes.map((index, i) => {
      let course = indexData.find(
        (course) => course.course_code === courses[i]
      );
      let indice = course.course_indices.find(
        (slot) => slot.index_code === index
      );
      return indice.id;
    });

    if (indexes.length === 0) {
      console.log("it is empty");
    } else {
      console.log(studentData);
      const data = await axios
        .post(
          `${BACKEND_URL}/courses/register/${studentData.id}/${studentData.student.id}`,
          {
            studentID: studentData.student.id,
            indexes: indexes,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .catch((err) => console.log(err));
    }
    window.location.reload();
  };

  const handleOpenCourse = async () => {
    await axios.get(`${BACKEND_URL}/courses/${courseName}`).then((response) => {
      console.log("OPEN COURSE", response);
      console.log("OPEN COURSE DATA", response.data);
      setCourseData(response.data);
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  let element;
  if (indexData !== undefined) {
    element = indexData.map((course, i) => {
      //console.log(course.course_indices.find(ele => ele.index_code === 320671).vacancy)
      let options;
      if (course.course_indices !== undefined) {
        options = course.course_indices.map((index, i) => {
          let x = <option value={i}>{index.index_code}</option>;
          return x;
        });
      }
      return (
        <tr>
          <th>{i + 1}</th>
          <td onClick={handleOpenCourse} className="courseCode">
            {course.course_code}
          </td>
          <Modal
            title="Course Details"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width="30vw"
            footer={null}
            className="modalBody"
          >
            <CourseModal courseData={courseData} />
            <div className="modalFooter">
              <Button onClick={handleOk} className="modalBtn">
                Exit
              </Button>
            </div>
          </Modal>
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(e) => handleChange(e, course)}
          >
            {options}
          </select>
          <td>
            {props.courseIndex[course.course_code] === undefined
              ? "--"
              : course.course_indices.find(
                  (ele) =>
                    ele.index_code === props.courseIndex[course.course_code]
                ).vacancy}
          </td>
        </tr>
      );
    });
  }
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Num</th>
            <th>Course</th>
            <th>Index</th>
            <th>Vacancy</th>
          </tr>
          {element}
        </thead>
      </table>
      <div className="buttonWrapper">
        <Button onClick={addCourse}>Add Courses</Button>
        <Button onClick={registerCourse}>Register Courses</Button>
        <Button onClick={deleteCourse}>Delete Course</Button>
      </div>
    </div>
  );
};
//<tbody>{element}</tbody>;
export default CourseReg;

function useGetIndexData(courses) {
  return useSWR(
    () => (courses ? `${BACKEND_URL}/courses/${courses}` : null),
    fetcher
  );
}
