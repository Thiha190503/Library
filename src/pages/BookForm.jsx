import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import useFirestore from "../hooks/useFirestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";

export default function Create() {
  let { id } = useParams;
  let navigate = useNavigate();

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [newCategory, setNewCategory] = useState("");
  let [categories, setCategories] = useState([]);
  let [file, setFile] = useState(null);
  let [preview, setPreview] = useState("");

  let { useUpdateDocument, useAddCollection } = useFirestore();

  useEffect(() => {
    //edit form
    if (id) {
      setIsEdit(true);
      let ref = doc(db, "books", id);
      getDoc(ref).then((doc) => {
        if (doc.exists()) {
          let { title, description, categories } = doc.data();
          setTitle(title);
          setDescription(description);
          setCategories(categories);
        }
      });
    }
    //create form
    else {
      setIsEdit(false);
      setTitle("");
      setDescription("");
      setCategories([]);
    }
  }, [id]);

  // Add Category
  let addCategory = () => {
    if (newCategory && categories.includes(newCategory)) {
      setNewCategory("");
      return;
    }
    setCategories((prev) => [newCategory, ...prev]);
    setNewCategory("");
  };

  // Photo
  let handlePhotoChange = (e) => {
    setFile(e.target.file[0]);
  };

  let handlePreviewImage = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result);
    };
  };

  useEffect(() => {
    if (file) {
      handlePreviewImage(file);
    }
  }, [file]);

  let uploadToFirebase = async (file) => {
    let uniqueFileName = Date.now().toString() + "_" + file.name;
    let path = "/covers/" + user.uid + "/" + uniqueFileName;
    let storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // Submit Form For Create or Update
  let submitForm = async (e) => {
    e.preventDefault();
    let url = await uploadToFirebase(file);
    let data = {
      title,
      description,
      categories,
      uid: user.uid,
      cover: url,
    };
    if (isEdit) {
      await useUpdateDocument("books", id, data);
    } else {
      await useAddCollection("books", data);
    }
    navigate("/");
  };

  return (
    <div className="h-screen">
      <form className="w-full max-w-lg mx-auto mt-5" onSubmit={submitForm}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password ${
                isDark ? "text-white" : ""
              }`}
            >
              Book Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="text"
              placeholder="Book Title"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password ${
                isDark ? "text-white" : ""
              }`}
            >
              Book Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="password"
              placeholder="Book Description"
            />
            <p className="text-gray-600 text-xs italic">
              Make it as long and as crazy as you would like
            </p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password ${
                isDark ? "text-white" : ""
              }`}
            >
              Categories
            </label>
            <div className="flex items-center space-x-2">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                type="text"
                placeholder="Book Category"
              />
              <button
                type="button"
                onClick={addCategory}
                className="bg-primary p-1 rounded-lg mb-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 p-1 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap">
            {categories.map((c) => (
              <span
                key={c}
                className="mx-1 my-1 text-white rounded-full px-2 py-1 text-sm bg-primary"
              >
                {" "}
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full px-3 my-3">
          <label
            className={`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password ${
              isDark ? "text-white" : ""
            }`}
          >
            Book Title
          </label>
          <input type="file" name="" id="" onChange={handlePhotoChange} />
          {!!preview && (
            <img
              src={preview}
              alt=""
              className="my-3"
              width={500}
              height={500}
            />
          )}
        </div>
        {/* create book */}
        <button className="text-white bg-primary px-3 py-2 rounded-2xl flex justify-center items-center gap-1 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="hidden md:block">
            {isEdit ? "Update" : "Create"} book
          </span>
        </button>
      </form>
    </div>
  );
}
