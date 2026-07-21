import api from "./api";

export const getConversations = async () => {
  const [usersRes, groupsRes] = await Promise.all([
    api.get("/conversations"),
    api.get("/groups"),
  ]);

  const users = usersRes.data.map((user) => ({
    ...user,
    type: "user",
  }));

  const groups = groupsRes.data.map((group) => ({
    ...group,
    type: "group",
  }));

  return [...users, ...groups];
};

export const removeMember = async (
  groupId,
  memberId
) => {
  const { data } = await api.patch(
    `/groups/${groupId}/remove-member`,
    {
      memberId,
    }
  );

  return data;
};

export const deleteGroup = async (groupId) => {
  const { data } = await api.delete(
    `/groups/${groupId}`
  );

  return data;
};