import axios from "axios";
import {
  Code,
  FileText,
  FolderKanban,
  Github,
  Image as ImageIcon,
  LayoutGrid,
  Link as LinkIcon,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import useAxiosSecure from "../../../hooks/useAxios";

// Types
interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveLink: string;
  githubLink: string;
}

interface ProjectFormInputs {
  title: string;
  description: string;
  image: FileList;
  technologies: string;
  liveLink: string;
  githubLink: string;
}

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
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInputs>();

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
        imageUrl,
        technologies: data.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        liveLink: data.liveLink || "",
        githubLink: data.githubLink || "",
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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/projects/${id}`);

        setProjects((prev) => prev.filter((p) => p._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Project has been deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);

        Swal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
      {/* ================= LEFT SIDE: PROJECT LIST (TABLE) ================= */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden h-fit sticky top-6">
        <div className="p-6 border-b border-border bg-sidebar/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <PlusCircle className="text-primary w-5 h-5" />
            Create Project
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new item to your portfolio.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <FileText size={14} /> Project Title
              </label>
              <Input
                {...register("title", { required: "Title required" })}
                placeholder="e.g., E-Commerce Dashboard"
                className="h-9"
              />
              {errors.title && (
                <p className="text-red-500 text-[10px]">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <ImageIcon size={14} /> Cover Image
              </label>
              <Input
                type="file"
                accept="image/*"
                className="h-9 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer pt-1"
                {...register("image", {
                  required: "Image required",
                  onChange: handleImageChange,
                })}
              />
              {errors.image && (
                <p className="text-red-500 text-[10px]">
                  {errors.image.message}
                </p>
              )}

              {preview && (
                <div className="mt-2 relative group rounded-lg overflow-hidden border border-border">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                    Image Selected
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Code size={14} /> Technologies
              </label>
              <Input
                {...register("technologies", {
                  required: "Technologies required",
                })}
                placeholder="React, Tailwind, Node.js"
                className="h-9"
              />
              <p className="text-[10px] text-muted-foreground">
                Separate multiple items with a comma.
              </p>
              {errors.technologies && (
                <p className="text-red-500 text-[10px]">
                  {errors.technologies.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon size={14} /> Live URL
                </label>
                <Input
                  {...register("liveLink")}
                  placeholder="https://"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <Github size={14} /> GitHub URL
                </label>
                <Input
                  {...register("githubLink")}
                  placeholder="https://"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <FileText size={14} /> Description
              </label>
              <Textarea
                {...register("description", {
                  required: "Description required",
                })}
                placeholder="Briefly describe the project..."
                className="resize-none h-24 text-sm"
              />
              {errors.description && (
                <p className="text-red-500 text-[10px]">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full font-semibold shadow-md"
            >
              {isSubmitting ? "Processing..." : "Publish Project"}
            </Button>
          </form>
        </div>
      </div>

      {/* ================= RIGHT SIDE: ADD FORM ================= */}

      <div className="xl:w-2/3 flex flex-col bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-sidebar/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <LayoutGrid className="text-primary w-5 h-5" />
              Project Portfolio
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and organize your published projects.
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {projects.length} Total
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {isFetching ? (
            <div className="flex justify-center items-center h-40 text-muted-foreground">
              Loading portfolio data...
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl bg-sidebar/30 text-muted-foreground">
              <FolderKanban className="w-10 h-10 mb-2 opacity-20" />
              <p>No projects found. Create one from the panel.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-medium">Preview</th>
                    <th className="pb-3 font-medium">Project Name</th>
                    <th className="pb-3 font-medium">Tech Stack</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects.map((project) => (
                    <tr
                      key={project._id}
                      className="group hover:bg-sidebar/50 transition-colors"
                    >
                      <td className="py-4 pr-4 w-24">
                        <div className="w-16 h-12 rounded-md overflow-hidden border border-border shadow-sm">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-foreground line-clamp-1">
                          {project.title}
                        </p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          {project.liveLink && (
                            <a
                              href={project.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-primary flex items-center gap-1"
                            >
                              <LinkIcon size={12} /> Live
                            </a>
                          )}
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-primary flex items-center gap-1"
                            >
                              <Github size={12} /> Repo
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-md text-[10px] font-medium uppercase tracking-wider"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-[10px] text-muted-foreground px-1">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
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
