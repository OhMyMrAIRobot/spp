import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Project } from './models/project';
import { Task } from './models/task';
import { User } from './models/user';
import { TaskStatusEnum } from './types/task-status';
import { UserRoleEnum } from './types/user/user-role';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
    ]);

    const passwordHash = await bcrypt.hash('123456789', 10);

    const users = await User.insertMany([
      {
        username: 'Admin',
        passwordHash,
        refreshHash: null,
        role: UserRoleEnum.ADMIN,
      },
      {
        username: 'User1',
        passwordHash,
        refreshHash: null,
        role: UserRoleEnum.MEMBER,
      },
      {
        username: 'User2',
        passwordHash,
        refreshHash: null,
        role: UserRoleEnum.MEMBER,
      },
      {
        username: 'User3',
        passwordHash,
        refreshHash: null,
        role: UserRoleEnum.MEMBER,
      },
    ]);

    const projects = await Project.insertMany([
      {
        title: 'Website Redesign',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac lectus lacus. Praesent in egestas tortor, et condimentum mi. Curabitur eleifend placerat dui, non finibus eros. Aliquam dolor lacus, dictum eget euismod id, cursus a mi. Phasellus sed lacus eget purus semper molestie. Aliquam a elementum odio.',
        members: [users[1]?._id, users[3]?._id],
      },
      {
        title: 'Company Rebranding',
        description:
          'Morbi semper mollis justo, ac porttitor velit sollicitudin vel. Nunc laoreet dui diam, sit amet dapibus purus tristique ut. Suspendisse elementum dapibus est, at molestie sapien ullamcorper pharetra. Sed consectetur vehicula orci et scelerisque. Donec et dolor aliquet, vehicula enim eu, vulputate libero. Mauris sollicitudin vel dui at consectetur. Vestibulum mattis nunc et arcu dignissim vestibulum. Nunc nec viverra nibh. Ut porta interdum congue. Suspendisse finibus vel nulla sed vestibulum. Proin fringilla varius rutrum.',
        members: [users[2]?._id, users[3]?._id],
      },
      {
        title: 'UI/UX Improvements',
        description:
          'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris quis bibendum odio. Vivamus mattis sem turpis, in fermentum leo dictum at. Integer malesuada gravida nunc sed tristique. Sed posuere at nisl quis ultricies. Curabitur id facilisis mi. Sed quis consequat lacus. Donec dolor est, commodo et imperdiet et, imperdiet ut mi.',
        members: [users[1]?._id, users[2]?._id, users[3]?._id],
      },
    ]);

    await Task.insertMany([
      // Website Redesign
      {
        title: 'Create homepage wireframes',
        description:
          'In dui dui, posuere eu rutrum sed, tempor id nibh. Morbi bibendum semper lacus at faucibus. Mauris sagittis viverra blandit. Curabitur libero nibh, molestie id vehicula eget, condimentum eu leo.',
        status: TaskStatusEnum.TODO,
        assignee: users[1]?._id,
        projectId: projects[0]?._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Develop responsive layout',
        description:
          'Proin tincidunt, elit ac auctor venenatis, tortor dui volutpat lorem, in aliquam turpis tellus eget libero. Nullam mollis tristique interdum. Sed ac augue a mi lacinia pretium at sit amet nisl. Nunc et porttitor justo, consectetur pellentesque lectus.',
        status: TaskStatusEnum.IN_PROGRESS,
        assignee: users[1]?._id,
        projectId: projects[0]?._id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Integrate CMS backend',
        description:
          'Nullam tristique mollis urna, vitae commodo risus. Quisque nec ultricies velit. Sed ultrices massa eget posuere egestas.',
        status: TaskStatusEnum.IN_PROGRESS,
        assignee: users[3]?._id,
        projectId: projects[0]?._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'QA testing and bug fixing',
        description:
          'Duis eleifend, turpis vel convallis elementum, ex ipsum pharetra enim, sed pretium dui tellus at risus. Integer sed maximus eros. In eu nunc venenatis metus molestie varius sed id nibh.',
        status: TaskStatusEnum.DONE,
        assignee: users[1]?._id,
        projectId: projects[0]?._id,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Deployment to production',
        description:
          'Aenean aliquet est vitae lorem iaculis, vitae dignissim nunc pulvinar. Cras dignissim, dui ut porttitor tincidunt, massa turpis volutpat ante, sagittis vulputate erat risus quis enim. Aenean non scelerisque velit. Duis at porta odio, ac auctor erat.',
        status: TaskStatusEnum.TODO,
        assignee: users[3]?._id,
        projectId: projects[0]?._id,
        dueDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
      },

      // Company Rebranding
      {
        title: 'Design new company logo',
        description:
          'Maecenas posuere felis ac tellus finibus, et tincidunt velit euismod. Fusce sollicitudin turpis lobortis felis cursus, eget bibendum arcu gravida. In hac habitasse platea dictumst. Mauris finibus faucibus odio id rhoncus. Proin auctor molestie venenatis.',
        status: TaskStatusEnum.IN_PROGRESS,
        assignee: users[2]?._id,
        projectId: projects[1]?._id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Update color palette and typography',
        description:
          'Aenean tempor posuere nunc. Nam vitae urna porttitor, condimentum nisi sed, laoreet odio. Donec viverra molestie consectetur. Nam quis magna turpis.',
        status: TaskStatusEnum.TODO,
        assignee: users[3]?._id,
        projectId: projects[1]?._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Prepare brand guideline document',
        description:
          'Ut id tellus vehicula, hendrerit elit eget, tempus lacus. Cras a est tincidunt, aliquam lectus a, tristique ante. Nullam dapibus mi sit amet dolor tristique sagittis.',
        status: TaskStatusEnum.IN_PROGRESS,
        assignee: users[2]?._id,
        projectId: projects[1]?._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Update marketing materials',
        description:
          'Aliquam non magna aliquet, aliquet tellus in, accumsan mi. Vivamus pulvinar consectetur tempor. Integer in est sit amet arcu tincidunt aliquam nec sit amet lorem.',
        status: TaskStatusEnum.TODO,
        assignee: users[2]?._id,
        projectId: projects[1]?._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Launch new brand campaign',
        description:
          'Aenean ullamcorper magna arcu, quis feugiat lectus pellentesque et. Quisque ac orci sit amet ligula eleifend pretium sit amet vitae turpis. Vestibulum aliquet convallis erat, id tempor metus tristique nec.',
        status: TaskStatusEnum.DONE,
        assignee: users[3]?._id,
        projectId: projects[1]?._id,
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },

      // UI/UX Improvements
      {
        title: 'Analyze user feedback',
        description:
          'Sed porta, nisi vitae consectetur consequat, sem leo accumsan elit, ac lobortis mauris arcu ac nulla.',
        status: TaskStatusEnum.TODO,
        assignee: users[1]?._id,
        projectId: projects[2]?._id,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Redesign navigation bar',
        description:
          'aecenas suscipit dictum erat ut rutrum. Sed sed lorem at leo pharetra cursus. Vestibulum a lectus non nibh elementum laoreet. Aliquam accumsan nisi ut nulla sollicitudin blandit sed eget libero. In auctor vitae metus in lacinia.',
        status: TaskStatusEnum.IN_PROGRESS,
        assignee: users[2]?._id,
        projectId: projects[2]?._id,
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Optimize form interactions',
        description:
          'Curabitur facilisis massa libero, nec laoreet nisl varius a. Maecenas tempus placerat dolor, in posuere tortor elementum nec. Vivamus vel volutpat mi.',
        status: TaskStatusEnum.TODO,
        assignee: users[3]?._id,
        projectId: projects[2]?._id,
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Improve loading performance',
        description:
          'Aenean et quam in purus auctor viverra id ut erat. Vivamus fermentum nibh eu leo viverra, sed mollis ex porta. Sed at vehicula augue. ',
        status: TaskStatusEnum.IN_PROGRESS,
        assignee: users[1]?._id,
        projectId: projects[2]?._id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Conduct usability testing',
        description:
          'Maecenas in ligula dignissim, hendrerit mi eget, sollicitudin dui. Phasellus eget consequat nunc. Nullam ligula orci, maximus sed dui non, ornare ultrices lorem.',
        status: TaskStatusEnum.DONE,
        assignee: users[2]?._id,
        projectId: projects[2]?._id,
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ]);

    await mongoose.disconnect();
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error while seeding:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
