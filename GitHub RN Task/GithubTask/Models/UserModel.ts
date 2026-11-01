import User from './User';

interface UserModel {
  total_count: number;
  items: User[];
  incomplete_results: boolean;
}
export default UserModel;
