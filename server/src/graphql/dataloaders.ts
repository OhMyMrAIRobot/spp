import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { Attachment, IAttachment } from '../models/attachment';
import { IProject, Project } from '../models/project';
import { IUser, User } from '../models/user';

export const createDataLoaders = () => {
  const userLoader = new DataLoader<string, IUser | null>(
    async (ids) => {
      const users = await User.find({
        _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
      }).exec();

      const userMap = new Map<string, IUser>(
        users.map((u) => [u._id.toString(), u.toJSON() as IUser]),
      );

      return ids.map((id) => userMap.get(id) || null);
    },
    {
      batch: true,
      cache: true,
      maxBatchSize: 100,
      batchScheduleFn: (cb) => setTimeout(cb, 10),
    },
  );

  const projectLoader = new DataLoader<string, IProject | null>(async (ids) => {
    const projects = await Project.find({
      _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
    }).exec();

    const projectMap = new Map<string, IProject>(
      projects.map((p) => [p._id.toString(), p.toJSON() as IProject]),
    );

    return ids.map((id) => projectMap.get(id) || null);
  });

  const attachmentsByTaskLoader = new DataLoader<string, IAttachment[]>(
    async (taskIds) => {
      const attachments = await Attachment.find({
        taskId: { $in: taskIds.map((id) => new Types.ObjectId(id)) },
      }).exec();

      const attachmentMap = new Map<string, IAttachment[]>();
      taskIds.forEach((id) => attachmentMap.set(id, []));

      attachments.forEach((att) => {
        const taskId = att.taskId.toString();
        const existing = attachmentMap.get(taskId) || [];
        existing.push(att.toJSON() as IAttachment);
        attachmentMap.set(taskId, existing);
      });

      return taskIds.map((id) => attachmentMap.get(id) || []);
    },
  );

  const membersByProjectLoader = new DataLoader<string, IUser[]>(
    async (projectIds) => {
      const projects = await Project.find({
        _id: { $in: projectIds.map((id) => new Types.ObjectId(id)) },
      }).exec();

      const allMemberIds = new Set<string>();
      projects.forEach((p) => {
        p.members.forEach((m) => allMemberIds.add(m.toString()));
      });

      const users = await User.find({
        _id: {
          $in: Array.from(allMemberIds).map((id) => new Types.ObjectId(id)),
        },
      }).exec();

      const userMap = new Map<string, IUser>(
        users.map((u) => [u._id.toString(), u.toJSON() as IUser]),
      );

      const projectMembersMap = new Map<string, IUser[]>();
      projects.forEach((p) => {
        const members: IUser[] = [];
        p.members.forEach((m) => {
          const user = userMap.get(m.toString());
          if (user) {
            members.push(user);
          }
        });
        projectMembersMap.set(p._id.toString(), members);
      });

      return projectIds.map((id) => projectMembersMap.get(id) || []);
    },
  );

  return {
    userLoader,
    projectLoader,
    attachmentsByTaskLoader,
    membersByProjectLoader,
  };
};
