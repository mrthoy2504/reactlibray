import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACK_URL } from "../../URL.jsx";

const AdminUnreturn = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUnreturnedBooks();
  }, []);

  const fetchUnreturnedBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACK_URL}/api/unreturn`);
      setMembers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h2>Members with Unreturned Books</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Member Name</th>
            <th>Total Unreturned</th>
            <th>Book Details</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.name}>
              <td>
                {index + 1}.{member.name}
              </td>
              <td>{members.member.borrowings.lenght}</td>
              <td>
                <ul>
                  {member.borrowings.map((borrowing,index) => (
                    <li key={borrowing.id}>

                      <td className="w-64">{index+1}. {borrowing.book.title}</td>
                      <td> (ID: {borrowing.bookId})</td>
                      <td>
                        Due:{new Date(borrowing.dueDate).toLocaleDateString()}
                      </td>

                      <br />
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUnreturn;
