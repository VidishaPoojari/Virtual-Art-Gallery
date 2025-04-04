
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useArtwork } from "@/contexts/ArtworkContext";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must not exceed 500 characters" }),
  category: z.enum(["Painting", "Digital Art", "Photography", "Other"], {
    required_error: "Please select a category",
  }),
  imageUrl: z.string().min(1, { message: "Please provide an image URL" }),
});

type FormValues = z.infer<typeof formSchema>;

const UploadArtworkPage = () => {
  const { uploadArtwork, isLoading } = useArtwork();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Painting",
      imageUrl: "",
    },
  });

  // Redirect if not authenticated or not a student
  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "student")) {
      navigate("/login");
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  const onSubmit = async (values: FormValues) => {
    await uploadArtwork(
      values.title,
      values.description,
      values.category as "Painting" | "Digital Art" | "Photography" | "Other",
      values.imageUrl
    );
    navigate("/gallery");
  };

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImagePreview(url.length > 0 ? url : null);
    form.setValue("imageUrl", url);
  };

  // Mock image URLs for demo purposes (normally this would come from file upload)
  const sampleImageUrls = [
    "https://images.unsplash.com/photo-1617552368352-5f0f190719a3?q=80&w=1000",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
    "https://images.unsplash.com/photo-1518623001395-125242310d0c?q=80&w=1000",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000",
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Upload Artwork</h1>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              For this demo, please use an image URL instead of file upload. In a production environment, 
              we would implement secure file uploads with size and format validation.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Artwork Details</CardTitle>
              <CardDescription>
                Share your artwork with the gallery community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6 md:col-span-1">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter the title of your artwork" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Painting">Painting</SelectItem>
                                <SelectItem value="Digital Art">Digital Art</SelectItem>
                                <SelectItem value="Photography">Photography</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your artwork..." 
                                className="resize-none min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6 md:col-span-1">
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter image URL" 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleImagePreview(e);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="border rounded-md p-2 mt-2">
                        <p className="text-sm text-gray-500 mb-2">Sample Image URLs (click to use):</p>
                        <div className="space-y-1">
                          {sampleImageUrls.map((url, index) => (
                            <div 
                              key={index}
                              className="text-xs text-blue-500 hover:underline cursor-pointer truncate"
                              onClick={() => {
                                form.setValue("imageUrl", url);
                                setImagePreview(url);
                              }}
                            >
                              {url}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-sm font-medium mb-2">Image Preview</h3>
                        {imagePreview ? (
                          <div className="relative aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-contain"
                              onError={() => setImagePreview(null)}
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                            <div className="text-center">
                              <Image className="mx-auto h-12 w-12 mb-2" />
                              <p className="text-sm">No image preview</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Artwork
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadArtworkPage;
