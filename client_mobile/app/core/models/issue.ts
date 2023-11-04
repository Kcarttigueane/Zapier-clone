export interface IssueModel {
  id: number;
  userId: number;
  category: 'bug' | 'feature request' | 'question' | 'other';
  description: string;
  status: 'open' | 'closed';
}
