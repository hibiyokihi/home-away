import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { SubmitButton } from '@/components/form/Buttons';
import {
  updateProfileAction,
  updateProfileImageAction,
  fetchProfile,
} from '@/utils/actions';
import ImageInputContainer from '@/components/form/ImageInputContainer';

async function ProfilePage() {
  const profile = await fetchProfile();
  // fetchProfileで!profileの対応を書いてるから、TSの'possibly null'エラーは生じない
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">user profile</h1>
      <div className="border p-8 rounded-md">
        <ImageInputContainer
          image={profile.profileImage}
          name={profile.username}
          action={updateProfileImageAction}
          text="Update Profile Image"
        />
        <FormContainer action={updateProfileAction}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <FormInput
              name="firstName"
              label="First Name"
              type="text"
              defaultValue={profile.firstName}
            />
            <FormInput
              name="lastName"
              label="Last Name"
              type="text"
              defaultValue={profile.lastName}
            />
            <FormInput
              name="username"
              label="Username"
              type="text"
              defaultValue={profile.username}
            />
          </div>
          <SubmitButton text="Update Profile" className="mt-8" />
        </FormContainer>
      </div>
    </section>
  );
}
export default ProfilePage;
