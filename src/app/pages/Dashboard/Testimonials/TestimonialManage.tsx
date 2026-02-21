import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { MessageSquareQuote, Trash2, PlusCircle, Star, User as UserIcon, Briefcase } from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxios";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import TableSkeleton from "../../../components/TableSkeleton";


// Types
interface Testimonial {
  _id: string;
  clientName: string;
  designation: string;
  message: string;
  rating: number;
}

interface TestimonialFormInputs {
  clientName: string;
  designation: string;
  message: string;
  rating: number;
}

const TestimonialManage = () => {
  const axiosSecure = useAxiosSecure();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormInputs>();

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<TestimonialFormInputs> = async (data) => {
    try {
      // Rating ta string theke number e convert kore nite hobe backend er jonno
      await axiosSecure.post("/testimonials", { 
        ...data, 
        rating: Number(data.rating) 
      });
      
      fetchTestimonials();
      reset();
      alert("Testimonial added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this client review?")) return;
    try {
      await axiosSecure.delete(`/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full">
      {/* ================= LEFT SIDE: TESTIMONIAL LIST ================= */}
      <div className="xl:w-2/3 flex flex-col bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-sidebar/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <MessageSquareQuote className="text-primary w-5 h-5" />
              Client Reviews
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Manage feedback and testimonials from your clients.</p>
          </div>
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {testimonials.length} Reviews
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {isFetching ? (
           <TableSkeleton/>
          ) : testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-xl bg-sidebar/30 text-muted-foreground">
              <MessageSquareQuote className="w-10 h-10 mb-2 opacity-20" />
              <p>No testimonials found. Add one from the panel.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {testimonials.map((testi) => (
                <div key={testi._id} className="p-5 border border-border rounded-xl flex justify-between gap-4 bg-sidebar/10 hover:border-primary/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2 text-amber-500">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                    <p className="text-sm italic text-foreground mb-3 line-clamp-2">"{testi.message}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {testi.clientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-none">{testi.clientName}</p>
                        <p className="text-xs text-muted-foreground mt-1">{testi.designation}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(testi._id)} 
                      className="text-muted-foreground hover:text-red-600 hover:bg-red-50 h-8 w-8"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE: ADD FORM ================= */}
      <div className="xl:w-1/3 bg-background rounded-2xl border border-border shadow-sm overflow-hidden h-fit sticky top-6">
        <div className="p-6 border-b border-border bg-sidebar/50">
          <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <PlusCircle className="text-primary w-5 h-5" />
            Add Review
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Publish a new client testimonial.</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <UserIcon size={14} /> Client Name
              </label>
              <Input
                {...register("clientName", { required: "Name required" })}
                placeholder="e.g., Jane Doe"
                className="h-9"
              />
              {errors.clientName && <p className="text-red-500 text-[10px]">{errors.clientName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Briefcase size={14} /> Designation / Company
              </label>
              <Input
                {...register("designation", { required: "Designation required" })}
                placeholder="e.g., CEO at TechCorp"
                className="h-9"
              />
              {errors.designation && <p className="text-red-500 text-[10px]">{errors.designation.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <Star size={14} /> Rating (1-5)
              </label>
              <Input
                type="number"
                min="1"
                max="5"
                {...register("rating", { required: "Rating required", min: 1, max: 5 })}
                placeholder="5"
                className="h-9"
              />
              {errors.rating && <p className="text-red-500 text-[10px]">{errors.rating.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                <MessageSquareQuote size={14} /> Review Message
              </label>
              <Textarea
                {...register("message", { required: "Message required" })}
                placeholder="Client's review..."
                className="resize-none h-24 text-sm"
              />
              {errors.message && <p className="text-red-500 text-[10px]">{errors.message.message}</p>}
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full font-semibold shadow-md">
              {isSubmitting ? "Publishing..." : "Publish Review"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestimonialManage;