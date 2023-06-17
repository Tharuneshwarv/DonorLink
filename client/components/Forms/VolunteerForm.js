import React, { useState, useEffect } from "react";
import styles from "../../styles/components/Forms/commonStyle.module.css";
import axios from "axios";
import useGeoLocation from "hooks/useGeoLocation";

const VolunteerForm = () => {
  const location = useGeoLocation();
  const [detail, setDetail] = useState({
    picture: "",
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    coordinates: "",
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    console.log(base64);
    setDetail({ ...detail, picture: base64 });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  let name, value;
  const handleInput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setDetail({
      ...detail,
      [name]: value,
      coordinates: `${
        location.loaded
          ? JSON.stringify(location.coordinates)
          : "Could not access the location"
      }`,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteerRegistration`,
        detail,
        {
          withCredentials: true,
        }
      );

      setDetail({
        picture: "",
        name: "",
        email: "",
        phone: "",
        bio: "",
        address: "",
        coordinates: "",
      });
    } catch (err) {
      console.log("error while submitting volunteer registration form", err);
    }
  };

  return (
    <>
      <div className={styles.body}>
        <div className={styles.left}></div>
        <div className={styles.right}>
          <h3>Registration Form</h3>
          <form method="post" className={styles.form}>
            <input
              type="file"
              label="Image"
              name="myFile"
              id="file-upload"
              accept=".jpeg, .png, .jpg"
              onChange={(e) => handleFileUpload(e)}
            />
            <input
              value={detail.name}
              onChange={handleInput}
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              required
            />
            <input
              value={detail.email}
              onChange={handleInput}
              type="email"
              name="email"
              id="email"
              placeholder="email"
              required
            />
            <input
              value={detail.phone}
              onChange={handleInput}
              type="number"
              name="phone"
              id="phone"
              placeholder="phone number"
              required
            />
            <textarea
              rows="5"
              value={detail.bio}
              onChange={handleInput}
              type="text"
              name="bio"
              id="bio"
              placeholder="write something about your self"
            />
            <textarea
              rows="5"
              value={detail.address}
              onChange={handleInput}
              type="text"
              name="address"
              id="address"
              placeholder="address"
            />
            <input type="submit" onClick={handleClick} />
            {detail.coordinates == ""
              ? "allow access to location"
              : detail.coordinates}
          </form>
        </div>
      </div>
    </>
  );
};

export default VolunteerForm;
