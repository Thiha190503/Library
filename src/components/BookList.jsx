import useFirestore from "../hooks/useFirestore";

export default function BookList() {
  let { useGetCollection, useDeleteDocument } = useFirestore();

  let {
    data: books,
    loading,
    error,
  } = useGetCollection("books", ["uid", "==", user.uid], {
    field: "title",
    value: search,
  });

  let deleteBook = async (e, id) => {
    e.preventDefault();
    await useDeleteDocument("books", id);
  };

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div>
      {loading && <p>loading ... </p>}
      {/* book list */}
      {!!books && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-3">
          {books.map((b) => (
            <Link to={`/books/${b.id}`} key={b.id}>
              <div
                className={`p-4 border border-1 min-h-[420px] ${
                  isDark ? "text-white bg-dcard border-primary" : ""
                }`}
              >
                <img src={b.cover} alt="" />
                <div className="text-center space-y-2 mt-3">
                  <h1>{b.title}</h1>
                  <p>{b.description}</p>
                  {/* genres */}
                  <div className="flex flex-wrap justify-between items-center">
                    <div>
                      {b.categories.map((c) => (
                        <span
                          key={c}
                          className="mx-1 my-1 text-white rounded-full px-2 py-1 text-sm bg-blue-500"
                        >
                          {" "}
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-5 items-center">
                      <img
                        src={pencil}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/edit/${b.id}`);
                        }}
                        alt=""
                      />
                      <img
                        src={trash}
                        alt=""
                        onClick={(e) => deleteBook(e, b.id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {books && !books.length && (
        <p className="text-center text-xl text-gray-500">
          No Search Results Found
        </p>
      )}
    </div>
  );
}