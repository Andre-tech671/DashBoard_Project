import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateView } from '@/components/refine-ui/views/create-view'
import { useBack } from '@refinedev/core'
import React from 'react'
import { Button } from '@/components/ui/button' // or your own Button component
import { Separator } from '@/components/ui/separator';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {zodResolver} from '@hookform/resolvers/zod';
import { useForm } from '@refinedev/react-hook-form';
import { classSchema } from '@/lib/schema'
import * as Z from 'zod';

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import UploadWidget from '@/components/upload-widget'





function ClassesCreate() {
  const back = useBack();

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
        resource: 'classes',
        action: 'create'
    },
  })

  const {
    handleSubmit, 
    formState: {isSubmitting, errors},
    control,
 } = form;

 const onSubmit = async (values: Z.infer<typeof classSchema>) => {
  try {
    // Call refine's onFinish with the form values
    await form.refineCore.onFinish(values);

    // You can add success handling here, e.g.:
    // toast.success("Class created successfully!");
    // navigate("/classes");
  } catch (error) {
    console.error("Error submitting form:", error);

    // Add error handling here, e.g.:
    // toast.error("Failed to create class. Please try again.");
  }
};

 const teachers = [
  {
    id: 1,
    name: "John Smith",
    code: "JSMITH"
  },
  {
    id: 2,
    name: "Maria Lopez",
    code: "MLOPEZ"
  },
  {
    id: 3,
    name: "David Kim",
    code: "DKIM"
  }
];

// Subjects array
const subjects = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH"
  },
  {
    id: 2,
    name: "Science",
    code: "SCI"
  },
  {
    id: 3,
    name: "History",
    code: "HIST"
  }
];

const bannerPublicId = form.watch('bannerCldPubId');
const setBannerImage = (file: any, field: any) => {
    if(file){
        field.onChange(file.url);
        form.setValue('bannerCldPubId', file.publicId, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }else{
        field.onChange('');
        form.setValue('bannerCldPubId', '', {
            shouldValidate: true,
            shouldDirty: true,
        })

    }
}


  return (
    <CreateView>
      <Breadcrumb />

      <h1 className='page-title'>Create a Class</h1>

      <div className='intro-row'>
        <p>Provide the required information below to add a class.</p>
        <Button onClick={back}>Go Back</Button>
      </div>

      <Separator />

      <div className='my-4 flex items-center'>
        <Card className="class-form-card">
            <CardHeader className='relative z-10'>
                <CardTitle  className='text-2xl pb-0 font-bold'>Fill out the form</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent  className='mt-7'>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                        {/* Add your form fields here */}
                        <FormField 
                        control={control} 
                        name="bannerUrl" 
                         render= {({ field }) =>(
                            <FormItem>
                                <FormLabel>Banner Image<span className='text-orange-600'>*</span></FormLabel>
                                <FormControl>
                                    <UploadWidget 
                                    value={field.value ? {url: field.value, publicId: bannerPublicId ?? ''} : null}
                                    onChange={(file: any, field: any) => setBannerImage(file, field)}
                                    />
                                </FormControl>
                                <FormMessage />
                                {errors.bannerCldPubId && !errors.bannerUrl && (
                                    <p className='text-destructive'>{errors.bannerCldPubId.message?.toString()}</p>
                                )}
                            </FormItem>
                         )}
                       
                        />
                        <FormField control={control} 
                            name="name" 
                            render={({field})=>(
                            <FormItem>
                                <FormLabel>Class Name <span className='text-orange-600'>*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Introduction to Biology - Section A" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is you public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <div className='grid sm:grid-cols-2 gap-4'>
                            <FormField control={control} 
                                name="subjectId" 
                                render={({field})=>(
                            <FormItem>
                                <FormLabel>Subject <span className='text-orange-600'>*</span></FormLabel>
                                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem
                                            value={subject.id.toString()}
                                            key={subject.id}
                                            >
                                            {subject.name}({subject.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>   
                                </Select>
                                <FormDescription>
                                    Select the subject for this class.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                         <FormField control={control} 
                                name="teacherId" 
                                render={({field})=>(
                            <FormItem>
                                <FormLabel>Teacher <span className='text-orange-600'>*</span></FormLabel>
                                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select a teacher" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem
                                            value={teacher.id.toString()}
                                            key={teacher.id}
                                            >
                                            {teacher.name}({teacher.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>   
                                </Select>
                                <FormDescription>
                                    Select the subject for this class.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="capacity"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                Capacity <span className="text-orange-600">*</span>
                                </FormLabel>
                                <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    placeholder="30"
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? Number(value) : undefined);
                                    }}
                                    value={(field.value as number | undefined) ?? ""}
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="status"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                Status <span className="text-orange-600">*</span>
                                </FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                         />
                     </div>

                        <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>
                                Description <span className="text-orange-600">*</span>
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Brief description about the class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <Button type="submit" size="lg" className="w-full">
                        {isSubmitting ? (
                        <div className="flex gap-1">
                        <span>Creating Class...</span>
                        <Loader2 className="inline-block ml-2 animate-spin" />
                        </div>
                         ) : (
                        "Create Class"
                         )}
                        </Button>
                    </form>
                </Form>
            </CardContent>

        </Card>

      </div>

    </CreateView>
  )
}

export default ClassesCreate