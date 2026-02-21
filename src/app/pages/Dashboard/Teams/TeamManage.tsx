import axios from "axios";
import {
  Briefcase,
  Building2,
  Linkedin,
  PlusCircle,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import useAxiosSecure from "../../../../hooks/useAxios";
import TableSkeleton from "../../../components/TableSkeleton";

interface TeamMember {
  _id: string; // Changed from _id: string
  name: string;
  role: string;
  agency: string; // Added field
  imageUrl: string;
  linkedinUrl: string;
}

interface TeamFormInputs {
  name: string;
  role: string;
  agency: string;
  image: FileList;
  linkedinUrl: string;
}

const TeamManage = () => {
  const axiosSecure = useAxiosSecure();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormInputs>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const fetchTeam = async () => {
    try {
      setIsFetching(true);
      const res = await axiosSecure.get("/team");
      setTeam(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<TeamFormInputs> = async (data) => {
    try {
      const file = data.image[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      const newMember = {
        name: data.name,
        role: data.role,
        agency: data.agency,
        imageUrl: cloudRes.data.secure_url,
        linkedinUrl: data.linkedinUrl || "",
      };

      await axiosSecure.post("/team", newMember);
      fetchTeam();
      reset();
      setPreview(null);
      toast.success("Team member added!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add team member");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/team/${id}`);
        setTeam((prev) => prev.filter((t) => t._id !== id));
        Swal.fire("Deleted!", "Team member has been removed.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
      {/* ADD MEMBER FORM */}
      <div className="xl:w-1/3 bg-background rounded-2xl border shadow-sm overflow-hidden h-fit">
        <div className="p-6 border-b border-border bg-sidebar/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <PlusCircle className="text-primary w-5 h-5" /> Add Member
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <UserIcon size={14} /> Full Name
              </label>
              <Input
                {...register("name", { required: "Name required" })}
                placeholder="John Doe"
                className="h-9"
              />
            </div>

            {/* AGENCY FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Building2 size={14} /> Agency Name
              </label>
              <Input
                {...register("agency", { required: "Agency required" })}
                placeholder="Creative Solutions"
                className="h-9"
              />
              {errors.agency && (
                <p className="text-red-500 text-[10px]">
                  {errors.agency.message}
                </p>
              )}
            </div>

            {/* ROLE FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Briefcase size={14} /> Role
              </label>
              <Input
                {...register("role", { required: "Role required" })}
                placeholder="Lead Designer"
                className="h-9"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Profile Picture
              </label>
              <Input
                type="file"
                accept="image/*"
                className="h-9 pt-1"
                {...register("image", {
                  required: "Image required",
                  onChange: handleImageChange,
                })}
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover border"
                />
              )}
            </div>

            {/* LINKEDIN URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Linkedin size={14} /> LinkedIn URL
              </label>
              <Input
                {...register("linkedinUrl")}
                placeholder="https://..."
                className="h-9"
              />
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full font-semibold"
            >
              {isSubmitting ? "Adding..." : "Add Team Member"}
            </Button>
          </form>
        </div>
      </div>

      {/* TEAM ROSTER TABLE */}
      <div className="xl:w-2/3 flex flex-col bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-sidebar/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Users className="text-primary w-5 h-5" /> Team Roster
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage agency team members.
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {team.length} Members
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {isFetching ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-medium">Member</th>
                    <th className="pb-3 font-medium">Agency & Role</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {team.map((member) => (
                    <tr
                      key={member._id}
                      className="group hover:bg-sidebar/50 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <span className="font-semibold">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="font-medium text-foreground">
                          {member.agency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.role}
                        </p>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member._id)}
                          className="text-muted-foreground hover:text-red-600 h-8 w-8"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManage;
