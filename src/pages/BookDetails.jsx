import { useParams } from "react-router-dom";
import useFirestore from "../hooks/useFirestore";

export default function BookDetails() {
  let { id } = useParams();
  let { useGetDocument } = useFirestore();
  let { data: book, loading, error } = useGetDocument("books", id);

  return (
    <>
      {error && <p>{error}</p>}
      {loading && <p>loading ....</p>}
      {book && (
        <>
          <div className={`grid grid-cols-2 ${isDark ? "text-white" : ""}`}>
            <div>
              <img src={book.cover} alt="" className="w-[80%]" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <div className="space-x-3">
                {book.categories.map((cateogry) => (
                  <span
                    className="bg-blue-500 text-white rounded-full text-sm px-2 py-1"
                    key={cateogry}
                  >
                    {cateogry}
                  </span>
                ))}
              </div>
              <p>{book.description}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl text-primary my-3 text-center">
              My Notes
            </h3>
            {/* <NoteForm />
            <NoteList /> */}
          </div>
        </>
      )}
    </>
  );
}
