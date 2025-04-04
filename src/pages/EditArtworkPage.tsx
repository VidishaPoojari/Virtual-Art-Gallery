
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Loader2, Save } from "lucide-react";

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
});

type FormValues = z.infer<typeof formSchema>;

const EditArtworkPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getArtworkById, updateArtwork, isLoading } = useArtwork();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const artwork = getArtworkById(id || "");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Painting",
    },
  });
  
  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (!isLoading && !artwork) {
      navigate("/gallery");
      return;
    }
    
    if (!isLoading && 
        (!isAuthenticated || 
         (user?.id !== artwork?.studentId && user?.role !== "admin"))) {
      navigate("/login");
      return;
    }
    
    if (artwork) {
      form.reset({
        title: artwork.title,
        description: artwork.description,
        category: artwork.category,
      });
    }
  }, [isAuthenticated, user, artwork, isLoading, form, navigate]);

  const onSubmit = async (values: FormValues) => {
    if (!artwork) return;
    
    await updateArtwork(
      artwork.id,
      values.title,
      values.description,
      values.category as "Painting" | "Digital Art" | "Photography" | "Other"
    );
    navigate(`/artwork/${artwork.id}`);
  };

  if (!artwork) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Artwork Not Found</h1>
          <p className="mb-6">The artwork you're trying to edit doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/gallery")}>Back to Gallery</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Artwork</h1>

          <Card>
            <CardHeader>
              <CardTitle>Edit Artwork Details</CardTitle>
              <CardDescription>
                Update information about your artwork
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
                              <Input {...field} />
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
                      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-sm font-medium mb-2">Image Preview</h3>
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Image cannot be edited in this version.
                        </p>
                      </div>

                      <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-sm font-medium mb-2">Artwork Info</h3>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium">Artist:</span>{" "}
                            {artwork.studentName}
                          </p>
                          <p>
                            <span className="font-medium">Uploaded:</span>{" "}
                            {new Date(artwork.createdAt).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Comments:</span>{" "}
                            {artwork.comments.length}
                          </p>
                          <p>
                            <span className="font-medium">Likes:</span>{" "}
                            {artwork.likes}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate(`/artwork/${artwork.id}`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
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

export default EditArtworkPage;
