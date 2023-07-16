import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const formSchema = z.object({
  query: z.coerce.string().min(1, "Please enter a value").max(50),
});

const SearchBar = ({ trackResults }: {trackResults: (T: any) => void}) => {
  const [tracks, setTracks] = useState({});
  const ctx = useContext(AuthContext);
  const onSubmit = async (query: z.infer<typeof formSchema>) => {
    let trackParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.accessToken,
      },
    };
    if (query) {
      fetch(
        `https://api.spotify.com/v1/search?q=${query.query}&type=track`,
        trackParameters
      )
        .then((res) => res.json())
        .then((data) => setTracks(data.tracks.items));
    }
  };

  useEffect(() => {
    if (tracks) {
      return trackResults(tracks);
    }
  }, [tracks]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex space-x-2 text-black"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search for music</FormLabel>
              <FormControl>
                <Input placeholder="Search..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enter</Button>
      </form>
    </Form>
  );
};

export default SearchBar;
