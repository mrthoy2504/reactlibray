import React, { useState, useEffect } from "react";
import axios from "axios";

const UnreturnedBooks = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUnreturnedBooks();
  }, []);

  const fetchUnreturnedBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/unreturn");
      setMembers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="alert alert-danger my-5">{error}</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Members with Unreturned Books</h2>
      {members.length === 0 ? (
        <div className="alert alert-info">No unreturned books found</div>
      ) : (
        <div className="">
          <table className="w-full ">
            <thead className="">
              <tr className="bg-blue-400 text-white h-10">
                <th className="border border-gray-400">Member Name</th>
                <th className="border border-gray-400">Total Books</th>
                <th className="border border-gray-400">Book Details</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id} className="border border-gray-300">
                  <td className="border border-gray-400 w-[250px]">
                 <b className="mx-5"> {index + 1}.{member.name} </b>   
                  </td>
                  {/* <td>{member.unreturnedCount}</td> */}
                  <td className="text-center border border-gray-400">{member.totalBooks}</td>
                  <td className="border border-gray-400">
                    <ul className="">
                      {member.borrowings.map((borrowing) => {
                        const daysOverdue = getDaysOverdue(borrowing.dueDate);
                        return (
                          <>
                            <td key={borrowing.id} className="mb-2  ">
                              <strong className="mx-5">{borrowing.book.title}</strong>

                              <div className="mr-16  ">
                                <b className="text-blue-400">- วันที่ยืม: </b>

                                {new Date(
                                  borrowing.borrowDate
                                ).toLocaleDateString()}
                          </div>
                          <div className="mr-16  ">
                                <b className="text-blue-600">
                                  {" "}
                                -  กำหนดส่ง:{" "}
                                </b>
                              
                                {new Date(
                                  borrowing.dueDate
                                ).toLocaleDateString()}
                              </div>
                              <div>
                                {daysOverdue < 0 && (
                                  <span className="">
                                    <b className="text-red-400">
                                      {" "}
                                      วันที่เกินกำหนด:{" "}
                                    </b>
                                    {daysOverdue} วัน
                                  </span>
                                )}
                              </div>
                            </td>
                          </>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UnreturnedBooks;
