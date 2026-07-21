import Conversation from "../models/Conversation.js";

export const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;

    if (!groupName?.trim()) {
      return res.status(400).json({
        message: "Group name is required.",
      });
    }

    if (!members || members.length < 2) {
      return res.status(400).json({
        message: "Select at least 2 members.",
      });
    }

    const uniqueMembers = [
      ...new Set([...members, req.user.id]),
    ];

    const group = await Conversation.create({
      type: "group",
      groupName,
      members: uniqueMembers,
      admin: req.user.id,
    });

    const populatedGroup = await Conversation.findById(group._id)
      .populate("members", "name email avatar isOnline")
      .populate("admin", "name email avatar");

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Conversation.find({
      type: "group",
      members: req.user.id,
    })
      .populate("members", "name email avatar isOnline")
      .populate("admin", "name email avatar")
      .sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    const group = await Conversation.findById(id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    if (group.type !== "group") {
      return res.status(400).json({
        message: "Invalid group.",
      });
    }

    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can remove members.",
      });
    }

    if (memberId === group.admin.toString()) {
      return res.status(400).json({
        message: "Admin cannot remove himself.",
      });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );

    await group.save();

    const updatedGroup = await Conversation.findById(group._id)
      .populate("members", "name email avatar isOnline")
      .populate("admin", "name email avatar");

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Conversation.findById(id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can delete the group.",
      });
    }

    await Conversation.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Group deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};