import axios from "axios";
import {
  FileText,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  LayoutGrid,
  Link as LinkIcon,
  MapPin,
  Paintbrush,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import useAxiosSecure from "../../../../hooks/useAxios";
import type { Project, ProjectFormInputs } from "../../../../types/types";
import TableSkeleton from "../../../components/TableSkeleton";

const ProjectsManage = () => {
  const axiosSecure = useAxiosSecure();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<ProjectFormInputs>();

  const selectedBg = watch("bgColor");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsFetching(true);
      const res = await axiosSecure.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onSubmit: SubmitHandler<ProjectFormInputs> = async (data) => {
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

      const imageUrl = cloudRes.data.secure_url;

      const newProject = {
        title: data.title,
        description: data.description,
        location: data.location,
        liveLink: data.liveLink || "",
        image: imageUrl,
        bgColor: data.bgColor,
      };

      await axiosSecure.post("/projects", newProject);

      fetchProjects();
      reset();
      setPreview(null);
      toast.success("Project added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add project");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p._id !== id));
        Swal.fire("Deleted!", "Project has been removed.", "success");
      } catch {
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full p-4 lg:p-0">
      <div className="xl:w-1/3 bg-background rounded-2xl border border-border shadow-sm overflow-hidden h-fit sticky top-6">
        <div className="p-6 border-b border-border bg-sidebar/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <PlusCircle className="text-primary w-5 h-5" />
            Create Project
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <FileText size={14} /> Project Title
              </label>
              <Input
                {...register("title", { required: "Title required" })}
                placeholder="Project name"
                className="h-9"
              />
            </div>

            {/* Location & BG Color Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <MapPin size={14} /> Location
                </label>
                <Input
                  {...register("location", { required: "Location required" })}
                  placeholder="e.g. China"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <Paintbrush size={14} /> Background
                </label>
                <select
                  {...register("bgColor", { required: "Color required" })}
                  className={`flex h-9 w-full rounded-md border border-input px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${selectedBg}`}
                >
                  <option value="">Select BG</option>
                  <option value="bg-orange-50" className="bg-orange-50">
                    Orange Light
                  </option>
                  <option value="bg-blue-50" className="bg-blue-50">
                    Blue Light
                  </option>
                  <option value="bg-green-50" className="bg-green-50">
                    Green Light
                  </option>
                  <option value="bg-purple-50" className="bg-purple-50">
                    Purple Light
                  </option>
                  <option value="bg-slate-100" className="bg-slate-100">
                    Slate Gray
                  </option>
                  <option value="bg-red-50" className="bg-red-50">
                    Red Light
                  </option>
                </select>
              </div>
            </div>

            {/* Live Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <LinkIcon size={14} /> Live Link
              </label>
              <Input
                {...register("liveLink", { required: "Link required" })}
                placeholder="https://example.com"
                className="h-9"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <ImageIcon size={14} /> Cover Image
              </label>
              <Input
                type="file"
                accept="image/*"
                className="h-9 pt-1 cursor-pointer"
                {...register("image", {
                  required: "Image required",
                  onChange: handleImageChange,
                })}
              />
              {preview && (
                <div className="mt-2 relative rounded-lg overflow-hidden border border-border h-32">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <FileText size={14} /> Description
              </label>
              <Textarea
                {...register("description", {
                  required: "Description required",
                })}
                placeholder="Details..."
                className="resize-none h-20 text-sm"
              />
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full font-semibold"
            >
              {isSubmitting ? "Uploading..." : "Publish Project"}
            </Button>
          </form>
        </div>
      </div>

      {/* ================= RIGHT SIDE: PROJECT LIST ================= */}
      <div className="xl:w-2/3 flex flex-col bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-sidebar/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <LayoutGrid className="text-primary w-5 h-5" />
              Project Portfolio
            </h2>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {projects.length} Total
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {isFetching ? (
            <TableSkeleton />
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl bg-sidebar/30">
              <FolderKanban className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-muted-foreground">No projects found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-medium">Preview</th>
                    <th className="pb-3 font-medium">Project Name</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects.map((project) => (
                    <tr
                      key={project._id}
                      className={`group transition-colors ${project.bgColor}`}
                    >
                      <td className="py-4 pr-4 w-24">
                        <div className="w-16 h-12 ml-2 rounded-md overflow-hidden border border-border shadow-sm bg-white">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-bold text-foreground">
                          {project.title}
                        </p>
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-primary flex items-center gap-1 text-xs text-muted-foreground"
                        >
                          <Globe size={12} /> Visit Site
                        </a>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <MapPin size={12} className="text-muted-foreground" />
                          {project.location}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(project._id)}
                          className="text-muted-foreground hover:text-red-600 hover:bg-red-50 h-8 w-8"
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

export default ProjectsManage;
