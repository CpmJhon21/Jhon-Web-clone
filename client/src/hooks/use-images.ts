import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertImage } from "@shared/routes";

// GET /api/images
export function useImages() {
  return useQuery({
    queryKey: [api.images.list.path],
    queryFn: async () => {
      const res = await fetch(api.images.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch images");
      return api.images.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/images/:id
export function useImage(id: number) {
  return useQuery({
    queryKey: [api.images.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.images.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch image");
      return api.images.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/images
export function useCreateImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertImage) => {
      const res = await fetch(api.images.create.path, {
        method: api.images.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.images.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create image");
      }
      return api.images.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.images.list.path] });
    },
  });
}
