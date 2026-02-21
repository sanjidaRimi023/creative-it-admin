import axios from "axios";
import {
  Briefcase,
  Globe,
  ImageIcon,
  MapPin,
  MessageSquareQuote,
  PlusCircle,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import useAxiosSecure from "../../../../hooks/useAxios";
import TableSkeleton from "../../../components/TableSkeleton";
import type { Testimonial } from "../../../../types/types";
import type { TestimonialFormInputs } from "../../../../types/types";


const TestimonialManage = () => {
  const axiosSecure = useAxiosSecure();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TestimonialFormInputs>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchTestimonials = async () => {
    try {
      setIsFetching(true);
      const res = await axiosSecure.get("/testimonials");
      setTestimonials(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const onSubmit: SubmitHandler<TestimonialFormInputs> = async (data) => {
    try {
      const file = data.image[0];
      if (!file) return;

      // 1. Image Upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      // 2. Data Submission
      const newTestimony = {
        clientName: data.clientName,
        review: data.review,
        image: cloudRes.data.secure_url,
        location: data.location,
        role: data.role,
        country: data.country,
      };

      await axiosSecure.post("/testimonials", newTestimony);

      fetchTestimonials();
      reset();
      setPreview(null);
      toast.success("Review published!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axiosSecure.delete(`/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full p-4 lg:p-0">
      {/* ================= LEFT SIDE: LIST ================= */}
      <div className="xl:w-2/3 flex flex-col bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-sidebar/50 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquareQuote className="text-primary w-5 h-5" />
            Active Testimonials
          </h2>
        </div>

        <div className="p-6 overflow-auto">
          {isFetching ? (
            <TableSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((testi) => (
                <div
                  key={testi._id}
                  className="p-4 border border-border rounded-xl bg-sidebar/10 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={testi.image}
                        className="w-10 h-10 rounded-lg object-cover"
                        alt=""
                      />
                      <div>
                        <p className="font-bold text-sm leading-none">
                          {testi.clientName}
                        </p>
                        <p className="text-[10px] text-primary font-medium mt-1 uppercase">
                          {testi.role}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(testi._id)}
                      className="h-8 w-8 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <p className="text-xs italic text-muted-foreground line-clamp-2">
                    "{testi.review}"
                  </p>
                  <div className="mt-3 pt-3 border-t flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>{testi.location}</span>
                    <span>{testi.country}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM ================= */}
      <div className="xl:w-1/3 bg-background rounded-2xl border border-border shadow-sm h-fit sticky top-6">
        <div className="p-6 border-b border-border bg-sidebar/50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PlusCircle className="text-primary w-5 h-5" />
            Add Review
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
              <UserIcon size={14} /> Client Name
            </label>
            <Input
              {...register("clientName", { required: true })}
              placeholder="Jane Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Briefcase size={14} /> Role
              </label>
              <Input
                {...register("role", { required: true })}
                placeholder="CEO"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <MapPin size={14} /> Location
              </label>
              <Input
                {...register("location", { required: true })}
                placeholder="TechCorp"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
              <Globe size={14} /> Country
            </label>
            <Input
              {...register("country", { required: true })}
              placeholder="USA"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
              <ImageIcon size={14} /> Client Image
            </label>
            <Input
              type="file"
              accept="image/*"
              {...register("image", {
                required: true,
                onChange: handleImageChange,
              })}
            />
            {preview && (
              <img
                src={preview}
                className="w-full h-20 object-cover rounded-lg border mt-2"
                alt="Preview"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
              <MessageSquareQuote size={14} /> Review
            </label>
            <Textarea
              {...register("review", { required: true })}
              placeholder="Review message..."
              className="h-20"
            />
          </div>

          <Button disabled={isSubmitting} className="w-full font-bold">
            {isSubmitting ? "Uploading..." : "Publish Review"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialManage;
