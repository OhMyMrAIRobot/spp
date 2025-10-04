import { IAttachment } from '../../models/attachment';

export type PublicAttachment = Pick<
  IAttachment,
  'id' | 'originalName' | 'size' | 'uploadedBy' | 'createdAt'
>;
