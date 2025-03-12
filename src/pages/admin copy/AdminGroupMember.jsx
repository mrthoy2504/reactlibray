import GroupMembers from "../admin/AdminGroupMemberDetail.jsx";

export default function AdminGroupMember() {
  return (
    <div>
      <b className="mx-5 text-gray-400"> รายการหมวดหมู่สมาชิก </b>{" "}
      <div>
        <GroupMembers />
      </div>
    </div>
  );
}
